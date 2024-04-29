import { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { User } from '../../models';
import avater from './../../assets/avater.svg';

const CreateTransaction = () => {
  const [transactionID, setTransactionID] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [noUserFound, setNOUserFound] = useState(false);
  const [selectedReceiver, setSelectedReceiver] = useState<User>();

  const formik = useFormik({
    initialValues: {
      receiver: '',
      amount: '',
      cause: '',
    },

    validationSchema: Yup.object({
      receiver: Yup.string()
        .max(50, 'Must be 50 characters or less')
        .required('Required'),
      amount: Yup.number().required('Required'),
      cause: Yup.string()
        .max(50, 'Must be 50 characters or less')
        .required('Required'),
    }),

    onSubmit: (values) => {
      setLoading(true);
      setUsersList([]);

      // Clear existing values
      setErrorMessage('');
      setTransactionID('');

      axios
        .post(`${import.meta.env.VITE_BASE_URL}/transaction/create`, values)
        .then((res) => {
          setTransactionID(res.data.transaction_id);
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

  useEffect(() => {
    if (formik.values.receiver.length < 3) return setUsersList([]);
    // reset NoUserFound
    setNOUserFound(false);

    axios
      .post(`${import.meta.env.VITE_BASE_URL}/user/search`, {
        query: formik.values.receiver,
      })
      .then((res) => {
        setUsersList(res.data.slice(0, 5));
        if (res.data.length === 0) setNOUserFound(true);
      });
  }, [formik.values.receiver]);

  return (
    <div className="container">
      <h1 className="text-2xl font-semibold p-2 mb-5">Make Transaction</h1>

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
            <span className="font-medium mr-2">Unsuccessful transaction!</span>
            {errorMessage}
          </div>
        </div>
      )}

      {transactionID && (
        <div
          className="flex items-center p-4 mb-10 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
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
            <span className="font-medium mr-2">Successful transaction!</span>
            Transaction ID: {transactionID}
          </div>
        </div>
      )}

      <form className="max-w-md ml-10" onSubmit={formik.handleSubmit}>
        <div className="relative z-0 w-full mb-1 group">
          <input
            type="Text"
            id="receiver"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            autoComplete="off"
            disabled={isLoading}
            onChange={formik.handleChange}
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

        <div className="relative z-0 w-full mb-10 group">
          <div className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 py-2 outline-none">
            {usersList?.slice(0, 5).map((user) => (
              <div
                key={user.account}
                className="flex gap-2 items-center p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  formik.setFieldValue('receiver', user.account);
                  setSelectedReceiver(user);
                  setUsersList([user]);
                }}
              >
                <img
                  src={user.photo_url || avater}
                  alt=""
                  className="h-8 w-8 rounded-full"
                />
                <span>{user.name}</span>
              </div>
            ))}

            {noUserFound && (
              <span className="block text-sm pl-4">No users found.</span>
            )}
          </div>
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

        <button
          type="submit"
          disabled={noUserFound || !selectedReceiver || isLoading}
          className="text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          {isLoading ? 'Sending...' : 'Send Money'}
        </button>
      </form>
    </div>
  );
};

export default CreateTransaction;
