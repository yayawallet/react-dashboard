import { useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import BulkImport from '../../common/BulkImport';
import SearchUserInline from '../../common/SearchUserInline';

const Create = () => {
  const [scheduledPaymentID, setScheduledPaymentID] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [inputFormType, setInputFormType] = useState('one'); // one or multiple

  const handleOnLoading = (value: boolean) => setLoading(value);
  const handleOnError = (value: string) => setErrorMessage(value);
  const handleOnSuccess = (value: string) => setSuccessMessage(value);

  const formik = useFormik({
    initialValues: {
      account_number: '',
      amount: '',
      cause: '',
      recurring: '',
      start_at: new Date().getTime() / 1000,
    },

    validationSchema: Yup.object({
      account_number: Yup.string().max(50, 'Must be 50 characters or less').required('Required'),
      amount: Yup.number().required('Required'),
      cause: Yup.string().max(50, 'Must be 50 characters or less').required('Required'),
      recurring: Yup.string().required('Select recurring type'),
      start_at: Yup.date()
        .required('Select start date & time')
        .test('startDate', 'start time must be in the future', (value) => {
          return new Date(value).getTime() > new Date().getTime() + 60000; // 60000 == 1 minutes
        }),
    }),

    onSubmit: (values) => {
      setLoading(true);

      // Clear existing values
      setScheduledPaymentID('');
      setSuccessMessage('');
      setErrorMessage('');

      values.start_at = new Date(values.start_at).getTime() / 1000;
      values.account_number = selectedUser;
      axios
        .post(`${import.meta.env.VITE_BASE_URL}/scheduled-payment/create`, values)
        .then((res) => {
          setScheduledPaymentID(res.data.id);
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
    <div className="container">
      <h1 className="text-2xl font-semibold p-2 mb-5">Schedule Payments</h1>

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
            <span className="font-medium mr-2">Unsuccessful schedule!</span>
            {errorMessage}
          </div>
        </div>
      )}

      {(scheduledPaymentID || successMessage) && (
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
            <span className="font-medium mr-2">Successful schedule!</span>
            {successMessage ? successMessage : `Scheduled Payment ID: ${scheduledPaymentID}`}
          </div>
        </div>
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
            <label htmlFor="topupFor" className="cursor-pointer">
              Single Schedule
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
            <label htmlFor="forOther" className="cursor-pointer">
              Multiple Schedules
            </label>
          </button>
        </div>
      </div>

      {inputFormType === 'one' ? (
        <form className="max-w-md ml-10 mt-16" onSubmit={formik.handleSubmit}>
          <div className="relative z-0 w-full mb-1 group">
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
              Receiver
            </label>

            <span className="text-xs text-red-600">
              {formik.touched.account_number && formik.errors.account_number}
            </span>
          </div>

          <SearchUserInline
            query={formik.values.account_number}
            onSelecteUser={(value) => setSelectedUser(value)}
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

          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative z-0 w-full mb-10 group">
              <select
                id="recurring"
                className="w-full bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none"
                onChange={formik.handleChange}
                value={formik.values.recurring}
              >
                <option value="" disabled>
                  Recurring Type
                </option>
                <option value="once">Once</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <span className="text-xs text-red-600">
                {formik.touched.recurring && formik.errors.recurring}
              </span>
            </div>

            <div className="relative z-0 w-full mb-10 group">
              <input
                type="datetime-local"
                id="start_at"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                autoComplete="off"
                disabled={isLoading}
                onChange={formik.handleChange}
              />
              <label
                htmlFor="start_at"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Start Date
              </label>

              <span className="text-xs text-red-600">
                {formik.touched.start_at && formik.errors.start_at}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={userNotFound || !selectedUser || isLoading}
            className="text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {isLoading ? 'Please wait...' : 'Schedule Payment'}
          </button>
        </form>
      ) : (
        <BulkImport
          isLoading={isLoading}
          apiEndpoint="scheduled-payment/bulk-import"
          onLoading={handleOnLoading}
          onError={handleOnError}
          onSuccess={handleOnSuccess}
        />
      )}
    </div>
  );
};

export default Create;
