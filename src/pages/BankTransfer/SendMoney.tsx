import { useState } from 'react';
import { authAxios } from '../../api/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InlineNotification from '../../components/InlineNotification';
import { usePostData } from '../../hooks/useSWR';
import { Institution } from '../../models';

const CreateTransfer = () => {
  const [transferID, setTransferID] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);

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
      account_number: Yup.string().required('Required').max(30, 'Must be less than 30 characters'),
      amount: Yup.number().required('Required').min(1, 'Amount must cannot be less than 1.00'),
      sender_note: Yup.string().required('Required').max(50, 'Must be 50 characters or less'),
    }),

    onSubmit: (values) => {
      setLoading(true);

      // Clear existing values
      setErrorMessage('');
      setTransferID('');

      authAxios
        .post('/transfer/send', values)
        .then((res) => {
          setTransferID(res.data.transfer_id);
          setLoading(false);

          // clear input fields
          formik.resetForm();
        })
        .catch((error) => {
          setErrorMessage(error.response?.data.error || error.message);
          setLoading(false);
        });
    },
  });

  return (
    <div className="page-container">
      <h1 className="text-2xl font-semibold p-2 mb-5">Make Transaction</h1>

      {errorMessage && <InlineNotification type="error" info={errorMessage} />}

      {transferID && <InlineNotification type="success" info={`Transaction ID: ${transferID}`} />}

      <form
        className="max-w-xl ml-10 mt-16 shadow shadow-gray-300 px-10 py-6 rounded-lg"
        onSubmit={formik.handleSubmit}
      >
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-10">
            <select
              id="institution_code"
              className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg focus:ring-4 ring-gray-200 p-2.5 outline-none sidebar-scrollbar"
              onChange={formik.handleChange}
              value={formik.values.institution_code}
            >
              <option
                label="Choose Institution"
                disabled
                className="text-lg font-semibold"
              ></option>
              <option disabled className="text-[6px]"></option>
              {institutionList?.map((list: Institution) => (
                <option key={list.code} value={list.code} className="bg-slate-100 text-gray-800">
                  {`${list.code} - ${list.name}`}
                </option>
              ))}
              <option disabled></option>
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
              onChange={formik.handleChange}
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
