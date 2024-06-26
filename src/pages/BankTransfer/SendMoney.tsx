import { useState } from 'react';
import { authAxios } from '../../api/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InlineNotification from '../../components/InlineNotification';
import { usePostData } from '../../hooks/useSWR';
import { Institution } from '../../models';

const CreateTransfer = () => {
  const [transactionID, setTransactionID] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');

  const { data: institutionList } = usePostData('/financial-institution/list', {
    country: 'Ethiopia',
  });

  const formik = useFormik({
    initialValues: {
      institution_code: '',
      account_number: '',
      amount: '',
      sender_note: '',
    },

    validationSchema: Yup.object({
      account_number: Yup.string().required('Required').max(12, 'Must be 12 characters'),
      amount: Yup.number().required('Required'),
      sender_note: Yup.string().required('Required').max(50, 'Must be 50 characters or less'),
    }),

    onSubmit: (values) => {
      setLoading(true);

      // Clear existing values
      setErrorMessage('');
      setTransactionID('');

      values.account_number = selectedUser;
      authAxios
        .post('/transfer/send', values)
        .then((res) => {
          setTransactionID(res.data.transaction_id);
          setLoading(false);

          // clear input fields
          formik.resetForm();
        })
        .catch((error) => {
          setErrorMessage(error.response?.data.error || error.message), setLoading(false);
          console.log('One: ', error.response?.data.error);
          console.log('Two: ', error.message);
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
        className="max-w-xl ml-10 mt-16 shadow shadow-gray-300 px-10 py-6 rounded-lg"
        onSubmit={formik.handleSubmit}
      >
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-16">
            <select
              id="institution_code"
              className="w-full bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none"
              onChange={formik.handleChange}
              value={formik.values.institution_code}
            >
              <option label="Choose Institution code"></option>
              {institutionList?.map((list: Institution) => (
                <option key={list.code} value={list.code}>
                  {`${list.code} - ${list.name}`}
                </option>
              ))}
            </select>
            <span className="text-xs text-red-600">
              {formik.touched.institution_code && formik.errors.institution_code}
            </span>
          </div>

          <div className="relative z-0 w-full mb-10">
            <input
              type="Text"
              id="account_number"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              autoComplete="off"
              disabled={isLoading}
              onChange={(e) => {
                formik.handleChange(e);
                setSelectedUser('');
              }}
              value={formik.values.account_number}
            />
            <label
              htmlFor="account_number"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Account Number
            </label>

            <span className="text-xs text-red-600">
              {formik.touched.account_number && formik.errors.account_number}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-10">
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

          <div className="relative z-0 w-full mb-10">
            <input
              type="text"
              id="sender_note"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              autoComplete="off"
              disabled={isLoading}
              onChange={formik.handleChange}
              value={formik.values.sender_note}
            />
            <label
              htmlFor="sender_note"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Reason
            </label>

            <span className="text-xs text-red-600">
              {formik.touched.sender_note && formik.errors.sender_note}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          {isLoading ? 'Sending...' : 'Send Money'}
        </button>
      </form>
    </div>
  );
};

export default CreateTransfer;
