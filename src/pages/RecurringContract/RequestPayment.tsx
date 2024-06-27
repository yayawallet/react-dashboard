import { useState } from 'react';
import { authAxios } from '../../api/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import BulkImport from '../../components/BulkImport';
import InlineNotification from '../../components/InlineNotification';

const RequestPayment = () => {
  const [requestPaymentID, setRequestPaymentID] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [inputFormType, setInputFormType] = useState('one'); // one or multiple

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
      meta_data: '',
    },

    validationSchema: Yup.object({
      contract_number: Yup.string().max(50, 'Must be 50 characters or less').required('Required'),
      amount: Yup.number().required('Required'),
      cause: Yup.string().max(50, 'Must be 50 characters or less').required('Required'),
      notification_url: Yup.string().max(50, 'Must be 50 characters or less').url('Invalid url'),
      meta_data: Yup.object().json().typeError('Meta-data must be JSON format'),
    }),

    onSubmit: (values) => {
      setLoading(true);

      // Clear existing values
      setRequestPaymentID('');
      setSuccessMessage('');
      setErrorMessage('');
      values.meta_data = JSON.parse(values.meta_data);

      authAxios
        .post('/recurring-contract/request-payment', values)
        .then((res) => {
          setRequestPaymentID(res.data.payment_request_id);
          setLoading(false);

          // clear input fields
          formik.resetForm();
        })
        .catch((error) => {
          setErrorMessage(error.response?.data.error || error.message), setLoading(false);
        });
    },
  });

  return (
    <div className="page-container">
      <h1 className="text-2xl font-semibold p-2 mb-5">Request Payment</h1>

      {errorMessage && <InlineNotification type="error" info={errorMessage} />}

      {(requestPaymentID || successMessage) && (
        <InlineNotification
          type="success"
          customType="Uploaded"
          info={`${successMessage ? successMessage : `Payment ID: ${requestPaymentID}`}`}
        />
      )}

      <div className="border-2 rounded-lg p-2 px-5">
        <div className="flex gap-x-4 my-2 justify-end">
          <button
            className={`flex flex-wrap items-center gap-x-2 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-1.5 text-center ${inputFormType === 'one' ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'text-violet-900 border-2 border-violet-600 hover:bg-violet-100'}`}
            onClick={() => setInputFormType('one')}
          >
            <input
              id="oneInput"
              type="radio"
              name="input-type"
              className="w-4 h-4 cursor-pointer"
              checked={inputFormType === 'one'}
              onChange={() => setInputFormType('one')}
            />
            <label htmlFor="oneInput" className="cursor-pointer">
              Single Payment
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
              Multiple Payments
            </label>
          </button>
        </div>
      </div>

      {inputFormType === 'one' ? (
        <form className="max-w-lg ml-10 mt-16" onSubmit={formik.handleSubmit}>
          <div className="relative z-0 w-full mb-10 group">
            <input
              type="Text"
              id="contract_number"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              autoComplete="off"
              disabled={isLoading}
              onChange={formik.handleChange}
              value={formik.values.contract_number}
            />
            <label
              htmlFor="contract_number"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Contract Number
            </label>

            <span className="text-xs text-red-600">
              {formik.touched.contract_number && formik.errors.contract_number}
            </span>
          </div>

          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative z-0 w-full mb-10 group">
              <input
                type="number"
                id="amount"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                autoComplete="off"
                disabled={isLoading}
                onChange={formik.handleChange}
                value={formik.values.amount}
              />
              <label
                htmlFor="amount"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Amount
              </label>

              <span className="text-xs text-red-600">
                {formik.touched.amount && formik.errors.amount}
              </span>
            </div>

            <div className="relative z-0 w-full mb-10 group">
              <input
                type="text"
                id="cause"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                autoComplete="off"
                disabled={isLoading}
                onChange={formik.handleChange}
                value={formik.values.cause}
              />
              <label
                htmlFor="cause"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Reason
              </label>

              <span className="text-xs text-red-600">
                {formik.touched.cause && formik.errors.cause}
              </span>
            </div>
          </div>

          <div className="relative z-0 w-full mb-10 group">
            <input
              type="Text"
              id="notification_url"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              autoComplete="off"
              disabled={isLoading}
              onChange={formik.handleChange}
              value={formik.values.notification_url}
            />
            <label
              htmlFor="notification_url"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Notification URL
            </label>

            <span className="text-xs text-red-600">
              {formik.touched.notification_url && formik.errors.notification_url}
            </span>
          </div>

          <div className="relative z-0 w-full mb-10 group">
            <textarea
              rows={3}
              name="meta_data"
              id="meta_data"
              placeholder="Any meta_data in JSON Format"
              className="w-full px-2 py-1 border-2 rounded border-gray-300 focus:border-blue-600 outline-none"
              autoComplete="off"
              disabled={isLoading}
              onChange={formik.handleChange}
              value={formik.values.meta_data}
            ></textarea>
            <span className="text-xs text-red-600">
              {formik.touched.meta_data && formik.errors.meta_data}
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {isLoading ? 'Please wait...' : 'Create Contract'}
          </button>
        </form>
      ) : (
        <BulkImport
          isLoading={isLoading}
          apiEndpoint="recurring-contract/bulk-import-recurring-payment-request"
          onLoading={handleOnLoading}
          onError={handleOnError}
          onSuccess={handleOnSuccess}
          instruction={
            <>
              Your file must have the following columns:{' '}
              <span className="font-semibold">contract_number, amount, cause</span> &{' '}
              <span className="font-semibold">notification_url</span> (optional),{' '}
              <span className="font-semibold">meta_data</span> (optional)
            </>
          }
        />
      )}
    </div>
  );
};

export default RequestPayment;
