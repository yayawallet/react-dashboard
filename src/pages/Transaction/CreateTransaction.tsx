import { useState } from 'react';
import { authAxios } from '../../api/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import SearchUserInline from '../../components/SearchUserInline';
import InlineNotification from '../../components/InlineNotification';
import InputUserIconPlaceholder from '../../components/ui/InputUserIconPlaceholder';
import { useGetData } from '../../hooks/useSWR';

const CreateTransaction = () => {
  const [transactionID, setTransactionID] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { data: currentBalance } = useGetData('/user/balance');

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
      if (currentBalance && values.amount > currentBalance) {
        setErrorMessage('No enough balance');
        return;
      }

      setLoading(true);

      // Clear existing values
      setErrorMessage('');
      setTransactionID('');
      setSuccessMessage('');

      authAxios
        .post('/transaction/transaction-request', {
          receiver: selectedUser,
          amount: values.amount,
          cause: values.cause,
        })
        .then((res) => {
          setTransactionID(res.data.transaction_id);

          if (res.data.transaction_id === undefined)
            setSuccessMessage('Approval Request Sent to Approvers.');

          // clear input fields
          formik.resetForm();
        })
        .catch((error) => {
          setErrorMessage(
            error.response?.data?.message || error.response?.data?.error || error.message
          );
        })
        .finally(() => setLoading(false));
    },
  });

  return (
    <div className="page-container">
      <h1 className="text-2xl font-semibold p-2 mb-10">Create Transaction</h1>

      {errorMessage && <InlineNotification type="error" info={errorMessage} />}

      {transactionID && (
        <InlineNotification type="success" info={`Transaction ID: ${transactionID}`} />
      )}

      {successMessage && <InlineNotification type="success" info={successMessage} />}

      <div className="flex justify-center lg:mr-32 mt-6">
        <form
          className="w-[var(--form-width-small)] border p-8 pt-6 rounded-xl mb-20"
          onSubmit={formik.handleSubmit}
        >
          <div className="grid gap-6 md:grid-cols-5 mb-6">
            <div className="md:col-span-3">
              <label htmlFor="receiver" className="block mb-2 text-sm font-medium text-gray-900">
                Receiver
              </label>

              <div className="relative">
                <InputUserIconPlaceholder />
              </div>

              <input
                type="text"
                id="receiver"
                className="pl-8 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="receiver"
                autoFocus
                autoComplete="off"
                maxLength={12}
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
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900">
                Amount
              </label>
              <input
                type="number"
                step="any"
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
            disabled={!selectedUser || isLoading}
            className="text-white bg-yayaBrand-700 hover:bg-yayaBrand-800 focus:ring-4 focus:outline-none focus:ring-yayaBrand-300 font-medium rounded-lg text-sm w-full sm:w-[200px] px-5 py-2.5 text-center"
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
