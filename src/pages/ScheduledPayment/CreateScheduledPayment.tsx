import { useState } from 'react';
import { authAxios } from '../../api/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import BulkImport from '../../components/BulkImport';
import SearchUserInline from '../../components/SearchUserInline';
import InlineNotification from '../../components/InlineNotification';
import createSchedulePaymentTemplate from '../../assets/bulk-import-templates/create_scheduled-payment_template.xlsx';
import SelectElement from '../../components/SelectElement';
import InputUserIconPlaceholder from '../../components/ui/InputUserIconPlaceholder';

const Create = () => {
  const [scheduledPaymentID, setScheduledPaymentID] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [inputFormType, setInputFormType] = useState('single'); // single or multiple

  const handleOnLoading = (value: boolean) => setLoading(value);
  const handleOnError = (value: string) => setErrorMessage(value);
  const handleOnSuccess = (value: string) => setSuccessMessage(value);

  const formik = useFormik({
    initialValues: {
      account_number: '',
      amount: '',
      reason: '',
      recurring: '',
      start_at: '',
    },

    validationSchema: Yup.object({
      account_number: Yup.string().max(50, 'Must be 50 characters or less').required('Required'),
      amount: Yup.number().required('Required').min(1, 'Amount cannot be less than 1.00'),
      reason: Yup.string().max(50, 'Must be 50 characters or less').required('Required'),
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

      authAxios
        .post('/scheduled-payment/schedule-request', {
          ...values,
          account_number: selectedUser,
          start_at: values.start_at ? new Date(values.start_at).getTime() / 1000 : '',
        })
        .then((res) => {
          setScheduledPaymentID(res.data.id);

          if (res.data.id === undefined) setSuccessMessage('Approval Request Sent to Approvers.');

          // clear input fields
          formik.resetForm();
        })
        .catch((error) =>
          setErrorMessage(
            error.response?.data?.message || error.response?.data?.error || error.message
          )
        )
        .finally(() => {
          setLoading(false);
          setSelectedUser('');

          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        });
    },
  });

  return (
    <div className="page-container">
      <h1 className="text-2xl font-semibold p-2 mb-5">Schedule Payments</h1>

      {errorMessage && <InlineNotification type="error" info={errorMessage} />}

      {(scheduledPaymentID || successMessage) && (
        <InlineNotification
          type="success"
          customType="Uploaded"
          info={`${successMessage ? successMessage : `Scheduled Payment ID: ${scheduledPaymentID}`}`}
        />
      )}

      <div className="border border-b-0 rounded-t-xl p-2 px-5 max-w-[var(--form-width)] mx-auto bg-gray-50 mt-6">
        <div className="flex gap-x-4 my-2 justify-end">
          <button
            className={`flex flex-wrap items-center gap-x-2 focus:ring-4 focus:outline-none focus:ring-yaya-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-1.5 text-center ${inputFormType === 'single' ? 'bg-yaya-600 hover:bg-yaya-700 text-white' : 'text-yaya-900 border-2 border-yaya-600 hover:bg-yaya-100'}`}
            onClick={() => setInputFormType('single')}
          >
            <input
              id="oneInput"
              type="radio"
              name="input-type"
              className="w-4 h-4 cursor-pointer"
              checked={inputFormType === 'single'}
              onChange={() => setInputFormType('single')}
            />
            <label htmlFor="oneInput" className="cursor-pointer">
              Single Schedule
            </label>
          </button>

          <button
            className={`flex flex-wrap items-center gap-x-2 focus:ring-4 focus:outline-none focus:ring-yaya-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-1.5 text-center ${inputFormType === 'multiple' ? 'bg-yaya-600 hover:bg-yaya-700 text-white' : 'text-yaya-900 border-2 border-yaya-600 hover:bg-yaya-100'}`}
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
            <label htmlFor="multipleInput" className="cursor-pointer">
              Multiple Schedules
            </label>
          </button>
        </div>
      </div>

      {inputFormType === 'single' ? (
        <div className="max-w-[var(--form-width)] border p-8 pt-6 rounded-b-xl mx-auto mb-20">
          <form className="max-w-[var(--form-width-small)] mx-auto" onSubmit={formik.handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2 mb-6">
              <div>
                <label
                  htmlFor="account_number"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Account number
                </label>

                <div className="relative">
                  <InputUserIconPlaceholder />
                </div>

                <input
                  type="text"
                  id="account_number"
                  className="pl-8 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="account_number"
                  autoFocus
                  autoComplete="off"
                  maxLength={12}
                  disabled={isLoading}
                  onChange={formik.handleChange}
                  value={formik.values.account_number}
                />

                <SearchUserInline
                  query={formik.values.account_number}
                  onSelecteUser={(value) => {
                    setSelectedUser(value);
                    formik.setFieldValue('account_number', value);
                  }}
                />
              </div>
              <div>
                <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900">
                  Amount
                </label>
                <input
                  type="number"
                  step="any"
                  id="amount"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="Amount"
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

            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <SelectElement
                  title="Recurring type"
                  options={[
                    { code: 'once', value: 'Once' },
                    { code: 'daily', value: 'Daily' },
                    { code: 'weekly', value: 'Weekly' },
                    { code: 'monthly', value: 'Monthly' },
                  ]}
                  onSelect={(value) => formik.setFieldValue('recurring', value)}
                />
                <span className="text-sm text-red-600">
                  {formik.touched.recurring && formik.errors.recurring}
                </span>
              </div>

              <div>
                <input
                  type="datetime-local"
                  name="start_at"
                  id="start_at"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  disabled={isLoading}
                  value={formik.values.start_at}
                  onChange={formik.handleChange}
                />
                <span className="text-sm text-red-600">
                  {formik.touched.start_at && formik.errors.start_at}
                </span>
              </div>
            </div>

            <div className="my-6 md:mt-0">
              <label htmlFor="reason" className="block mb-2 text-sm font-medium text-gray-900">
                Reason
              </label>
              <input
                type="text"
                id="reason"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="reason"
                autoComplete="off"
                disabled={isLoading}
                onChange={formik.handleChange}
                value={formik.values.reason}
              />
              <span className="text-sm text-red-600">
                {formik.touched.reason && formik.errors.reason}
              </span>
            </div>

            <button
              type="submit"
              disabled={!selectedUser || isLoading}
              className="text-white bg-yaya-700 hover:bg-yaya-800 focus:ring-4 focus:outline-none focus:ring-yaya-300 font-medium rounded-lg text-sm w-full sm:w-[200px] px-5 py-2.5 text-center"
            >
              <span className="text-[15px]" style={{ letterSpacing: '0.3px' }}>
                {isLoading ? 'Please wait...' : 'Schedule Payment'}
              </span>
            </button>
          </form>
        </div>
      ) : (
        <BulkImport
          isLoading={isLoading}
          apiEndpoint="scheduled-payment/bulk-schedule-import-request"
          templateFile={createSchedulePaymentTemplate}
          onLoading={handleOnLoading}
          onError={handleOnError}
          onSuccess={handleOnSuccess}
          approvalRequest={true}
        />
      )}
    </div>
  );
};

export default Create;
