import { useState } from 'react';
import { authAxios } from '../../api/axios';
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
      amount: Yup.number().required('Required').min(1, 'Amount cannot be less than 1.00'),
      cause: Yup.string().required('Required').max(128, 'Must be 128 characters or less'),
    }),

    onSubmit: (values) => {
      setLoading(true);

      // Clear existing values
      setErrorMessage('');
      setTransactionID('');

      values.receiver = selectedUser;
      authAxios
        .post('/transaction/create', values)
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
      <h1 className="text-2xl font-semibold p-2 mb-10">Create Transaction</h1>

      {errorMessage && <InlineNotification type="error" info={errorMessage} />}

      {transactionID && (
        <InlineNotification type="success" info={`Transaction ID: ${transactionID}`} />
      )}

      <div className="flex justify-center lg:mr-40 mt-6">
        <form
          className="max-w-[var(--form-width-small)] border p-8 pt-6 rounded-xl mb-20"
          onSubmit={formik.handleSubmit}
        >
          <div className="grid gap-6 mb-68 md:grid-cols-5">
            <div className="col-span-3">
              <label htmlFor="receiver" className="block mb-2 text-sm font-medium text-gray-900">
                Receiver
              </label>
              <input
                type="text"
                id="receiver"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="receiver"
                autoComplete="off"
                disabled={isLoading}
                onChange={(e) => {
                  formik.handleChange(e);
                  setSelectedUser('');
                }}
                value={formik.values.receiver}
              />

              <SearchUserInline
                query={formik.values.receiver}
                onSelecteUser={(value) => {
                  setSelectedUser(value);
                  formik.setFieldValue('receiver', value);
                }}
                onUserNotFound={(value) => setUserNotFound(value)}
              />
            </div>

            <div className="col-span-2">
              <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="amount"
                autoComplete="off"
                disabled={isLoading}
                onChange={formik.handleChange}
                value={formik.values.amount}
              />
              <span className="text-sm text-red-600">
                {formik.touched.amount && formik.errors.amount}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="cause" className="block mb-2 text-sm font-medium text-gray-900">
              Reason
            </label>
            <input
              type="text"
              id="cause"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="reason"
              autoComplete="off"
              disabled={isLoading}
              onChange={formik.handleChange}
              value={formik.values.cause}
            />
            <span className="text-sm text-red-600">
              {formik.touched.cause && formik.errors.cause}
            </span>
          </div>

          <button
            type="submit"
            disabled={userNotFound || !selectedUser || isLoading}
            className="text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-[200px] px-5 py-2.5 text-center"
          >
            <span style={{ letterSpacing: '0.3px' }}>
              {isLoading ? 'Please wait...' : 'Send Money'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTransaction;
