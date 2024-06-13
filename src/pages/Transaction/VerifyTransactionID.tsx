import { useState } from 'react';
import { useFormik } from 'formik';
import { authAxios } from '../../api/axios';
import * as Yup from 'yup';
import { TRANSACTION_INVOICE_URL } from '../../CONSTANTS';
import { Transaction } from '../../models';
import InlineNotification from '../../components/InlineNotification';
import useAccessToken from '../../hooks/useAccessToken';

const GetTransactionByID = () => {
  const [ownAccount, setOwnAccount] = useState('');
  const [transaction, setTransaction] = useState<Transaction>();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);

  const { accessToken } = useAccessToken();

  const formik = useFormik({
    initialValues: {
      transactionID: '',
    },

    validationSchema: Yup.object({
      transactionID: Yup.string().max(50, 'Must be 50 characters or less').required('Required'),
    }),

    onSubmit: (values) => {
      setLoading(true);

      // Clear existing values
      setErrorMessage('');
      setTransaction(undefined);

      authAxios.get('/user/profile').then((res) => setOwnAccount(res.data.account));

      authAxios
        .get(`/transaction/find/${values.transactionID}`)
        .then((res) => {
          setTransaction(res.data);
          setLoading(false);

          // clear input fields
          formik.resetForm();
        })
        .catch((error) => {
          setErrorMessage(error.response?.data.error || 'Invalid transaction ID');
          setLoading(false);
        });
    },
  });

  return (
    <div className="page-container">
      <h1 className="text-2xl font-semibold p-2 mb-5">Verify Transaction IDs</h1>

      {errorMessage && <InlineNotification type="error" info={errorMessage} />}

      {transaction && (
        <div className="bg-white overflow-hidden mb-5">
          <button
            type="button"
            className="block ml-auto py-1.5 px-6 m-1 font-medium text-violet-900 focus:outline-none bg-white rounded-lg border border-violet-200 hover:bg-violet-100 hover:text-violet-700 focus:z-10 focus:ring-4 focus:ring-violet-100"
          >
            <a href={`${TRANSACTION_INVOICE_URL}/${transaction.id}`} target="_blank">
              Print Invoice
            </a>
          </button>
          <div className="border-2 shadow rounded-lg border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-2 sm:py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Transaction ID</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {transaction.id}
                </dd>
              </div>
              <div className="py-2 sm:py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Sender</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {transaction.sender.name}
                  <br />
                  <span className="text-gray-500 text-sm block" style={{ marginTop: '-3px' }}>
                    {'@' + transaction.sender.account}
                  </span>
                </dd>
              </div>
              <div className="py-2 sm:py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Receiver</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {transaction.receiver.name}
                  <br />
                  <span className="text-gray-500 text-sm block" style={{ marginTop: '-3px' }}>
                    {'@' + transaction.receiver.account}
                  </span>
                </dd>
              </div>
              <div className="py-2 sm:py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Amount</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {ownAccount === transaction.receiver.account ? (
                    <span className="inline-block ml-3  text-green-600">&#43;&nbsp;</span>
                  ) : (
                    <span className="inline-block ml-3 text-red-600">&#8722;&nbsp;</span>
                  )}
                  {transaction.amount_with_currency}
                </dd>
              </div>
              <div className="py-2 sm:py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Cause</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {transaction.cause}
                </dd>
              </div>

              <div className="py-2 sm:py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {`${new Date(Number(transaction?.created_at_time) * 1000).toLocaleString()}`}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      <form
        className="max-w-lg ml-10 mt-16 shadow shadow-slate-300 px-10 py-6 rounded-lg"
        onSubmit={formik.handleSubmit}
      >
        <div className="relative z-0 w-full mb-10 mt-10 group">
          <input
            type="Text"
            id="transactionID"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            disabled={isLoading}
            onChange={formik.handleChange}
            value={formik.values.transactionID}
          />
          <label
            htmlFor="transactionID"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Transaction ID
          </label>

          <span className="text-xs text-red-600">
            {formik.touched.transactionID && formik.errors.transactionID}
          </span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </div>
  );
};

export default GetTransactionByID;
