import { useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import SearchUserInline from '../../components/SearchUserInline';
import InlineNotification from '../../components/InlineNotification';

const CreateTransaction = () => {
  const [transactionID, setTransactionID] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');

  const formik = useFormik({
    initialValues: {
      receiver: '',
      amount: '',
      cause: '',
    },

    validationSchema: Yup.object({
      receiver: Yup.string().required('Required').max(12, 'Must be 12 characters'),
      amount: Yup.number().required('Required'),
      cause: Yup.string().required('Required').max(50, 'Must be 50 characters or less'),
    }),

    onSubmit: (values) => {
      setLoading(true);

      // Clear existing values
      setErrorMessage('');
      setTransactionID('');

      values.receiver = selectedUser;
      axios
        .post(`${import.meta.env.VITE_BASE_URL}/transaction/create`, values)
        .then((res) => {
          setTransactionID(res.data.transaction_id);
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
      <h1 className="text-2xl font-semibold p-2 mb-5">Make Transaction</h1>

      {errorMessage && <InlineNotification type="error" info={errorMessage} />}

      {transactionID && (
        <InlineNotification type="success" info={`Transaction ID: ${transactionID}`} />
      )}

      <form
        className="max-w-lg ml-10 mt-16 shadow shadow-gray-300 px-10 py-6 rounded-lg"
        onSubmit={formik.handleSubmit}
      >
        <div className="relative z-0 w-full mb-1 mt-10 group">
          <input
            type="Text"
            id="receiver"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            autoComplete="off"
            disabled={isLoading}
            onChange={(e) => {
              formik.handleChange(e);
              setSelectedUser('');
            }}
            value={formik.values.receiver}
          />
          <label
            htmlFor="receiver"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Receiver
          </label>

          <span className="text-xs text-red-600">
            {formik.touched.receiver && formik.errors.receiver}
          </span>
        </div>

        <SearchUserInline
          query={formik.values.receiver}
          onSelecteUser={(value) => {
            setSelectedUser(value);
            formik.setFieldValue('receiver', value);
          }}
          onUserNotFound={(value) => setUserNotFound(value)}
        />

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

        <button
          type="submit"
          disabled={userNotFound || !selectedUser || isLoading}
          className="text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          {isLoading ? 'Sending...' : 'Send Money'}
        </button>
      </form>
    </div>
  );
};

export default CreateTransaction;
