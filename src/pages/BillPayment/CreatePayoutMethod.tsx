import { useState } from 'react';
import { authAxios } from '../../api/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import BulkImport from '../../components/BulkImport';
import InlineNotification from '../../components/InlineNotification';
import createPayoutTemplate from '../../assets/bulk-import-templates/create_payout_template.xlsx';
import { useGetData } from '../../hooks/useSWR';
import InstitutionLIst from '../../components/InstitutionLIst';

const CreatePayoutMethod = () => {
  const [payoutMethodID, setPayoutMethodID] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [inputFormType, setInputFormType] = useState('single'); // single or multiple

  const { data: { account: ownAccount } = {} } = useGetData('/user/profile');

  const handleOnLoading = (value: boolean) => setLoading(value);
  const handleOnError = (value: string) => setErrorMessage(value);
  const handleOnSuccess = (value: string) => setSuccessMessage(value);

  const formik = useFormik({
    initialValues: {
      client_yaya_account: ownAccount || '',
      cluster: '',
      bill_code: '',
      institution: '',
      account_number: '',
    },

    enableReinitialize: true,

    validationSchema: Yup.object({
      cluster: Yup.string().required('cluster is required'),
      bill_code: Yup.string().required('bill_code is required'),
      institution: Yup.string().required('institution is required'),
      account_number: Yup.string().required('account_number is required'),
    }),

    onSubmit: (values) => {
      setLoading(true);

      // Clear existing values
      setPayoutMethodID('');
      setSuccessMessage('');
      setErrorMessage('');

      authAxios
        .post('/payout-method/create', values)
        .then((res) => {
          setPayoutMethodID(res.data.id);

          // clear input fields
          formik.resetForm();
        })
        .catch((error) => {
          setErrorMessage(
            error.response?.data?.error || error.response?.data?.message || error.message
          );
        })
        .finally(() => {
          setLoading(false);
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        });
    },
  });

  return (
    <div className="page-container">
      <h1 className="text-2xl font-semibold p-2 mb-5">Create Payout Methods</h1>

      {errorMessage && <InlineNotification type="error" info={errorMessage} />}

      {payoutMethodID && (
        <InlineNotification
          type="success"
          info={`${successMessage ? successMessage : `ID: ${payoutMethodID}`}`}
        />
      )}

      {successMessage && (
        <InlineNotification type="success" customType="Uploaded" info={successMessage} />
      )}

      <div className="border border-b-0 rounded-t-xl p-2 px-5 max-w-[var(--form-width)] mx-auto bg-gray-50 mt-6">
        <div className="flex gap-x-4 my-2 justify-end">
          <button
            className={`flex flex-wrap items-center gap-x-2 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-1.5 text-center ${inputFormType === 'single' ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'text-violet-900 border-2 border-violet-600 hover:bg-violet-100'}`}
            onClick={() => setInputFormType('single')}
          >
            <input
              id="oneInput"
              type="radio"
              name="input-type"
              className="w-4 h-4 cursor-pointer"
              checked={inputFormType === 'single'}
              onChange={() => setInputFormType('single')}
            />
            <label htmlFor="oneInput" className="cursor-pointer">
              Single Payout
            </label>
          </button>

          <button
            className={`flex flex-wrap items-center gap-x-2 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-1.5 text-center ${inputFormType === 'multiple' ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'text-violet-900 border-2 border-violet-600 hover:bg-violet-100'}`}
            onClick={() => setInputFormType('multiple')}
          >
            <input
              id="multipleInput"
              type="radio"
              name="input-type"
              className="w-4 h-4 cursor-pointer"
              checked={inputFormType === 'multiple'}
              onChange={() => setInputFormType('multiple')}
            />
            <label htmlFor="multipleInput" className="cursor-pointer">
              Multiple Payouts
            </label>
          </button>
        </div>
      </div>

      {inputFormType === 'single' ? (
        <div className="max-w-[var(--form-width)] border p-8 pt-6 rounded-b-xl mx-auto mb-20">
          <form className="max-w-[var(--form-width-small)] mx-auto" onSubmit={formik.handleSubmit}>
            <div className="grid gap-8 mb-8 md:grid-cols-2">
              <div>
                <label htmlFor="cluster" className="block mb-2 text-sm font-medium text-gray-900">
                  Cluster
                </label>
                <input
                  type="text"
                  id="cluster"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="cluster"
                  disabled={isLoading}
                  onChange={formik.handleChange}
                  value={formik.values.cluster}
                />
                <span className="text-sm text-red-600">
                  {formik.touched.cluster && formik.errors.cluster}
                </span>
              </div>

              <div>
                <label htmlFor="bill_code" className="block mb-2 text-sm font-medium text-gray-900">
                  Bill code
                </label>
                <input
                  type="text"
                  id="bill_code"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="bill_code"
                  disabled={isLoading}
                  onChange={formik.handleChange}
                  value={formik.values.bill_code}
                />
                <span className="text-sm text-red-600">
                  {formik.touched.bill_code && formik.errors.bill_code}
                </span>
              </div>
            </div>

            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <InstitutionLIst onSelect={(value) => formik.setFieldValue('institution', value)} />
                <span className="text-sm text-red-600">
                  {formik.touched.institution && formik.errors.institution}
                </span>
              </div>

              <div>
                <input
                  type="text"
                  id="account_number"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Account Number"
                  autoComplete="off"
                  disabled={isLoading}
                  onChange={formik.handleChange}
                  value={formik.values.account_number}
                />

                <span className="text-sm text-red-600">
                  {formik.touched.account_number && formik.errors.account_number}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-[200px] px-5 py-2.5 text-center"
            >
              <span className="text-[15px]" style={{ letterSpacing: '0.3px' }}>
                {isLoading ? 'Please wait...' : 'Create Payout'}
              </span>
            </button>
          </form>
        </div>
      ) : (
        <BulkImport
          isLoading={isLoading}
          apiEndpoint="billbulkimport/payout-methods"
          templateFile={createPayoutTemplate}
          onLoading={handleOnLoading}
          onError={handleOnError}
          onSuccess={handleOnSuccess}
        />
      )}
    </div>
  );
};

export default CreatePayoutMethod;
