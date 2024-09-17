import { useState } from 'react';
import { authAxios } from '../../api/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import BulkImport from '../../components/BulkImport';
import SearchUserInline from '../../components/SearchUserInline';
import InlineNotification from '../../components/InlineNotification';
import createContractTemplate from '../../assets/bulk-import-templates/create_contract_template.xlsx';
import InputUserIconPlaceholder from '../../components/ui/InputUserIconPlaceholder';

const CreateContract = () => {
  const [contractID, setContractID] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [inputFormType, setInputFormType] = useState('single'); // single or multiple

  const handleOnLoading = (value: boolean) => setLoading(value);
  const handleOnError = (value: string) => setErrorMessage(value);
  const handleOnSuccess = (value: string) => setSuccessMessage(value);

  const formik = useFormik({
    initialValues: {
      contract_number: '',
      service_type: '',
      customer_account_name: '',
    },

    validationSchema: Yup.object({
      contract_number: Yup.string().max(50, 'Must be 50 characters or less').required('Required'),
      service_type: Yup.string().max(128, 'Must be less than 128 characters').required('Required'),
      customer_account_name: Yup.string().max(12, 'Must be 12 characters').required('Required'),
    }),

    onSubmit: (values) => {
      setLoading(true);

      // Clear existing values
      setContractID('');
      setSuccessMessage('');
      setErrorMessage('');

      values.customer_account_name = selectedUser;
      authAxios
        .post('/recurring-contract/create', values)
        .then((res) => {
          setContractID(res.data.contract_id);

          // clear input fields
          formik.resetForm();
        })
        .catch((error) => {
          setErrorMessage(
            error.response?.data?.message || error.response?.data?.error || error.message
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
      <h1 className="text-2xl font-semibold p-2 mb-5">Recurring Contract</h1>

      {errorMessage && <InlineNotification type="error" info={errorMessage} />}

      {contractID && (
        <InlineNotification
          type="success"
          info={`${successMessage ? successMessage : `Contract ID: ${contractID}`}`}
        />
      )}

      {successMessage && (
        <InlineNotification
          type="success"
          customType="Uploaded"
          info={`${successMessage ? successMessage : `Contract ID: ${contractID}`}`}
        />
      )}

      <div className="border border-b-0 rounded-t-xl p-2 px-5 max-w-[var(--form-width)] mx-auto bg-gray-50 mt-6">
        <div className="flex gap-x-4 my-2 justify-end">
          <button
            className={`flex flex-wrap items-center gap-x-2 focus:ring-4 focus:outline-none focus:ring-yayaBrand-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-1.5 text-center ${inputFormType === 'single' ? 'bg-yayaBrand-600 hover:bg-yayaBrand-700 text-white' : 'text-yayaBrand-900 border-2 border-yayaBrand-600 hover:bg-yayaBrand-100'}`}
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
              Single Contract
            </label>
          </button>

          <button
            className={`flex flex-wrap items-center gap-x-2 focus:ring-4 focus:outline-none focus:ring-yayaBrand-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-1.5 text-center ${inputFormType === 'multiple' ? 'bg-yayaBrand-600 hover:bg-yayaBrand-700 text-white' : 'text-yayaBrand-900 border-2 border-yayaBrand-600 hover:bg-yayaBrand-100'}`}
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
              Multiple Contracts
            </label>
          </button>
        </div>
      </div>

      {inputFormType === 'single' ? (
        <div className="max-w-[var(--form-width)] border p-8 pt-6 rounded-b-xl mx-auto mb-20">
          <form className="max-w-[var(--form-width-small)] mx-auto" onSubmit={formik.handleSubmit}>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="contract_number"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Contract number
                </label>
                <input
                  type="text"
                  id="contract_number"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="contract_number"
                  autoComplete="contract_number"
                  disabled={isLoading}
                  onChange={formik.handleChange}
                  value={formik.values.contract_number}
                />
                <span className="text-sm text-red-600">
                  {formik.touched.contract_number && formik.errors.contract_number}
                </span>
              </div>

              <div>
                <label
                  htmlFor="service_type"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Service type
                </label>
                <input
                  type="text"
                  id="service_type"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="service_type"
                  disabled={isLoading}
                  onChange={formik.handleChange}
                  value={formik.values.service_type}
                />
                <span className="text-sm text-red-600">
                  {formik.touched.service_type && formik.errors.service_type}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="customer_account_name"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Customer YaYa account
              </label>

              <div className="relative">
                <InputUserIconPlaceholder />
              </div>

              <input
                type="text"
                id="customer_account_name"
                className="pl-8 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="customer_account_name"
                autoComplete="off"
                maxLength={12}
                disabled={isLoading}
                onChange={formik.handleChange}
                value={formik.values.customer_account_name}
              />

              <SearchUserInline
                query={formik.values.customer_account_name}
                onSelecteUser={(value) => {
                  setSelectedUser(value);
                  formik.setFieldValue('customer_account_name', value);
                }}
              />
            </div>

            <button
              type="submit"
              disabled={!selectedUser || isLoading}
              className="text-white bg-yayaBrand-700 hover:bg-yayaBrand-800 focus:ring-4 focus:outline-none focus:ring-yayaBrand-300 font-medium rounded-lg text-sm w-full sm:w-[200px] px-5 py-2.5 text-center"
            >
              <span className="text-[15px]" style={{ letterSpacing: '0.3px' }}>
                {isLoading ? 'Please wait...' : 'Create Contract'}
              </span>
            </button>
          </form>
        </div>
      ) : (
        <BulkImport
          isLoading={isLoading}
          apiEndpoint="recurring-contract/bulk-import-contract"
          templateFile={createContractTemplate}
          onLoading={handleOnLoading}
          onError={handleOnError}
          onSuccess={handleOnSuccess}
        />
      )}
    </div>
  );
};

export default CreateContract;
