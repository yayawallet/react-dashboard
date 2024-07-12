import { useState } from 'react';
import { authAxios } from '../../api/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import BulkImport from '../../components/BulkImport';
import InlineNotification from '../../components/InlineNotification';
import createRequestPaymentTemplate from '../../assets/bulk-import-templates/create_request-payment_template.xlsx';

const RequestPayment = () => {
  const [requestPaymentID, setRequestPaymentID] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [inputFormType, setInputFormType] = useState('single'); // single or multiple

  const handleOnLoading = (value: boolean) => setLoading(value);
  const handleOnError = (value: string) => setErrorMessage(value);
  const handleOnSuccess = (value: string) => setSuccessMessage(value);

  const formik = useFormik({
    initialValues: {
      contract_number: '',
      amount: '',
      currency: 'ETB',
      cause: '',
      notification_url: '',
    },

    validationSchema: Yup.object({
      contract_number: Yup.string().max(50, 'Must be 50 characters or less').required('Required'),
      amount: Yup.number().required('Required').min(1, 'Amount must cannot be less than 1.00'),
      cause: Yup.string().max(50, 'Must be 50 characters or less').required('Required'),
      notification_url: Yup.string().max(50, 'Must be 50 characters or less').url('Invalid url'),
    }),

    onSubmit: (values) => {
      setLoading(true);

      // Clear existing values
      setRequestPaymentID('');
      setSuccessMessage('');
      setErrorMessage('');

      authAxios
        .post('/recurring-contract/request-payment', values)
        .then((res) => {
          setRequestPaymentID(res.data.payment_request_id);

          // clear input fields
          formik.resetForm();
        })
        .catch((error) => {
          setErrorMessage(
            error.response.data?.message || error.response.data?.error || error.message
          );
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  return (
    <div className="page-container">
      <h1 className="text-2xl font-semibold p-2 mb-5">Request Payment</h1>

      {errorMessage && <InlineNotification type="error" info={errorMessage} />}

      {requestPaymentID && (
        <InlineNotification
          type="success"
          info={`${successMessage ? successMessage : `Payment ID: ${requestPaymentID}`}`}
        />
      )}

      {successMessage && (
        <InlineNotification
          type="success"
          customType="Uploaded"
          info={`${successMessage ? successMessage : `Payment ID: ${requestPaymentID}`}`}
        />
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
              Single Contract
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
              Multiple Contracts
            </label>
          </button>
        </div>
      </div>

      {inputFormType === 'single' ? (
        <div className="max-w-[var(--form-width)] border p-8 pt-6 rounded-b-xl mx-auto mb-20">
          <form className="max-w-[var(--form-width-small)] mx-auto" onSubmit={formik.handleSubmit}>
            <div className="grid gap-6 mb-6 md:grid-cols-5">
              <div className="md:col-span-3">
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
                  disabled={isLoading}
                  onChange={formik.handleChange}
                  value={formik.values.contract_number}
                />
                <span className="text-sm text-red-600">
                  {formik.touched.contract_number && formik.errors.contract_number}
                </span>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900">
                  Amount
                </label>
                <input
                  type="text"
                  id="amount"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="amount"
                  disabled={isLoading}
                  autoComplete="off"
                  onChange={formik.handleChange}
                  value={formik.values.amount}
                />
                <span className="text-sm text-red-600">
                  {formik.touched.amount && formik.errors.amount}
                </span>
              </div>
            </div>

            <div className="grid gap-6 mb-6 md:grid-cols-5">
              <div className="md:col-span-3">
                <label htmlFor="cause" className="block mb-2 text-sm font-medium text-gray-900">
                  Reason
                </label>
                <input
                  type="text"
                  id="cause"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="cause"
                  autoComplete="off"
                  disabled={isLoading}
                  onChange={formik.handleChange}
                  value={formik.values.cause}
                />
                <span className="text-sm text-red-600">
                  {formik.touched.cause && formik.errors.cause}
                </span>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="notification_url"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Notification URL
                  <span className="font-normal text-gray-400">&nbsp;(optional)</span>
                </label>
                <input
                  type="text"
                  id="notification_url"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="notification_url"
                  disabled={isLoading}
                  onChange={formik.handleChange}
                  value={formik.values.notification_url}
                />
                <span className="text-sm text-red-600">
                  {formik.touched.notification_url && formik.errors.notification_url}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-[200px] px-5 py-2.5 text-center"
            >
              <span className="text-[15px]" style={{ letterSpacing: '0.3px' }}>
                {isLoading ? 'Please wait...' : 'Request Payment'}
              </span>
            </button>
          </form>
        </div>
      ) : (
        <BulkImport
          isLoading={isLoading}
          apiEndpoint="recurring-contract/bulk-import-recurring-payment-request"
          templateFile={createRequestPaymentTemplate}
          onLoading={handleOnLoading}
          onError={handleOnError}
          onSuccess={handleOnSuccess}
        />
      )}
    </div>
  );
};

export default RequestPayment;
