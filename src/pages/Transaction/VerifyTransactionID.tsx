import { useState } from 'react';
import { useFormik } from 'formik';
import { authAxios } from '../../api/axios';
import * as Yup from 'yup';
import { TransactionType } from '../../models';
import InlineNotification from '../../components/InlineNotification';
import { PiPrinterFill } from 'react-icons/pi';
import { formatDate } from '../../utils/table_utils';
import { useGetData } from '../../hooks/useSWR';

const GetTransactionByID = () => {
  const [transaction, setTransaction] = useState<TransactionType>();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);

  const { data: { account: ownAccount } = {} } = useGetData('/user/profile');

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

      authAxios
        .get(`/transaction/find/${values.transactionID}`)
        .then((res) => {
          setTransaction(res.data);

          // clear input fields
          formik.resetForm();
        })
        .catch((error) => {
          setErrorMessage(
            error.response?.data?.message || error.response?.data?.error || 'Invalid transaction ID'
          );
        })
        .finally(() => setLoading(false));
    },
  });

  return (
    <div className="page-container">
      <h1 className="text-2xl font-semibold p-2 mb-10">Verify Transaction ID</h1>

      {errorMessage && <InlineNotification type="error" info={errorMessage} />}

      {transaction && (
        <div className="bg-white overflow-hidden mb-5">
          <button
            type="button"
            className="block ml-auto mb-2 py-2 px-6 font-medium text-white focus:outline-none bg-yaya-700 rounded-lg border border-yaya-700 hover:bg-yaya-800 focus:z-10 focus:ring-4 focus:ring-yaya-100"
          >
            <a
              href={`${import.meta.env.VITE_TRANSACTION_INVOICE_URL}/${transaction.id}`}
              target="_blank"
              className="flex items-center gap-2"
            >
              <span className="text-lg">
                <PiPrinterFill />
              </span>
              <span>Print Invoice</span>
            </a>
          </button>

          <div className="border shadow rounded-lg border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-2 sm:py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Sender</dt>
                <dd className="mt-1 text-gray-800 sm:mt-0 sm:col-span-5">
                  {transaction.sender.name}
                  <br />
                  <span className="text-gray-500 text-sm block" style={{ marginTop: '-3px' }}>
                    {'@' + transaction.sender.account}
                  </span>
                </dd>
              </div>
              <div className="py-2 sm:py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6">
                <dt className="font-medium text-gray-500">Receiver</dt>
                <dd className="mt-1 text-gray-800 sm:mt-0 sm:col-span-5">
                  {transaction.receiver.name}
                  <br />
                  <span className="text-gray-500 text-sm block" style={{ marginTop: '-3px' }}>
                    {'@' + transaction.receiver.account}
                  </span>
                </dd>
              </div>
              <div className="py-2 sm:py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6">
                <dt className="font-medium text-gray-500">Amount</dt>
                <dd className="mt-1 text-gray-800 sm:mt-0 sm:col-span-5">
                  {ownAccount === transaction.receiver.account ? (
                    <span className="inline-block text-green-600">&#43;&nbsp;</span>
                  ) : (
                    <span className="inline-block text-red-600">&#8722;&nbsp;</span>
                  )}
                  {transaction.amount_with_currency}
                </dd>
              </div>
              <div className="py-2 sm:py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6">
                <dt className="font-medium text-gray-500">Note</dt>
                <dd className="mt-1 text-gray-800 sm:mt-0 sm:col-span-5">
                  {transaction.sender_caption.split(',')[0]}
                </dd>
              </div>

              <div className="py-2 sm:py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6">
                <dt className="font-medium text-gray-500">Date</dt>
                <dd className="mt-1 text-gray-800 sm:mt-0 sm:col-span-5">
                  {`${formatDate(transaction?.created_at_time)}`}
                </dd>
              </div>
            </dl>
          </div>

          <div className="text-center mt-14 md:mr-40">
            <button
              className="text-white bg-yaya-700 hover:bg-yaya-800 focus:ring-4 focus:outline-none focus:ring-yaya-300 font-medium rounded-lg text-sm w-full sm:w-[200px] px-5 py-2.5 text-center"
              onClick={() => setTransaction(undefined)}
            >
              Verify Transaction ID
            </button>
          </div>
        </div>
      )}

      <div className={`${transaction ? 'hidden' : ''} flex justify-center lg:mr-32 mt-6`}>
        <form
          className="w-[var(--form-width-small)] border p-8 pt-6 rounded-xl mb-20"
          onSubmit={formik.handleSubmit}
        >
          <div className="mb-6">
            <label htmlFor="transactionID" className="block mb-2 text-sm font-medium text-gray-900">
              Transaction ID
            </label>
            <input
              type="text"
              id="transactionID"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="transaction_id"
              autoFocus
              autoComplete="off"
              disabled={isLoading}
              onChange={formik.handleChange}
              value={formik.values.transactionID}
            />
            <span className="text-sm text-red-600">
              {formik.touched.transactionID && formik.errors.transactionID}
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="text-white bg-yaya-700 hover:bg-yaya-800 focus:ring-4 focus:outline-none focus:ring-yaya-300 font-medium rounded-lg text-sm w-full sm:w-[200px] px-5 py-2.5 text-center"
          >
            <span style={{ letterSpacing: '0.3px' }}>
              {isLoading ? 'Please wait...' : 'Verify ID'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default GetTransactionByID;
