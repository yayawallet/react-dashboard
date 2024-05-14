import { useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const RequestPayment = () => {
  const [paymentRequestID, setPaymentRequestID] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      contract_number: '',
      amount: '',
      currency: 'ETB',
      cause: '',
      notification_url: '',
      // meta_data: '',
    },

    validationSchema: Yup.object({
      contract_number: Yup.string()
        .max(50, 'Must be 50 characters or less')
        .required('Required'),
      amount: Yup.number().required('Required'),
      cause: Yup.string()
        .max(50, 'Must be 50 characters or less')
        .required('Required'),
      notification_url: Yup.string()
        .max(50, 'Must be 50 characters or less')
        .url('Invalid url'),
      // meta_data: Yup.string().max(200, 'Must be 200 characters or less'),
    }),

    onSubmit: (values) => {
      setLoading(true);

      // Clear existing values
      setErrorMessage('');

      axios
        .post(
          `${import.meta.env.VITE_BASE_URL}/recurring-contract/request-payment`,
          values
        )
        .then((res) => {
          setPaymentRequestID(res.data.payment_request_id);
          setLoading(false);

          // clear input fields
          formik.resetForm();
        })
        .catch((error) => {
          setErrorMessage(error.response?.data.error || error.message),
            setLoading(false);
        });
    },
  });

  return (
    <div className="container">
      <h1 className="text-2xl font-semibold p-2 mb-5">Recurring Contract</h1>

      {errorMessage && (
        <div
          className="flex items-center p-4 mb-10 text-sm text-red-800 rounded-lg bg-red-50"
          role="alert"
        >
          <svg
            className="flex-shrink-0 inline w-4 h-4 me-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium mr-2">Unsuccessful Process!</span>
            {errorMessage}
          </div>
        </div>
      )}

      {paymentRequestID && (
        <div
          className="flex items-center p-4 mb-10 text-sm text-blue-800 rounded-lg bg-blue-50"
          role="alert"
        >
          <svg
            className="flex-shrink-0 inline w-4 h-4 me-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium mr-2">
              Payment requested successfully!
            </span>
            Scheduled Payment ID: {paymentRequestID}
          </div>
        </div>
      )}

      <div className="">
        <form className="max-w-md ml-10 mt-16" onSubmit={formik.handleSubmit}>
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
                Cause
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
              {formik.touched.notification_url &&
                formik.errors.notification_url}
            </span>
          </div>

          {/* <div className="relative z-0 w-full mb-10 group">
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
          </div> */}

          <button
            type="submit"
            disabled={isLoading}
            className="text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {isLoading ? 'Please wait...' : 'Create Contract'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestPayment;
