import { useState } from 'react';
import { authAxios } from '../../api/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import BulkImport from '../../components/BulkImport';
import SearchUserInline from '../../components/SearchUserInline';
import InlineNotification from '../../components/InlineNotification';

const CreateBill = () => {
  const [contractID, setContractID] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [, setUserNotFound] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [inputFormType, setInputFormType] = useState('one'); // one or multiple

  const handleOnLoading = (value: boolean) => setLoading(value);
  const handleOnError = (value: string) => setErrorMessage(value);
  const handleOnSuccess = (value: string) => setSuccessMessage(value);

  const formik = useFormik({
    initialValues: {
      client_yaya_account: 'tewobstatewo',
      customer_yaya_account: '',
      amount: '',
      customer_id: '',
      start_at: '',
      due_at: '',
      bill_id: '',
      bill_code: '',
      bill_season: '',
      fwd_institution: '',
      fwd_account_number: '',
      description: '',
      phone: '',
      email: '',
    },

    validate: (values) => {
      interface Errors {
        fwd_institution?: string;
        fwd_account_number?: string;
      }

      const errors: Errors = {};

      if (values.fwd_institution && !values.fwd_account_number) {
        errors.fwd_account_number = 'Account number is required';
      }

      if (values.fwd_account_number && !values.fwd_institution) {
        errors.fwd_institution = 'Fwd institution is required';
      }

      return errors;
    },

    validationSchema: Yup.object({
      customer_yaya_account: Yup.string(),
      amount: Yup.number().required('Amount is required'),
      start_at: Yup.date(),
      due_at: Yup.date().required('Due date is required'),
      customer_id: Yup.string().required('Customer ID is required'),
      bill_id: Yup.string().required('Bill ID is required'),
      bill_code: Yup.string(),
      bill_season: Yup.string(),
      fwd_institution: Yup.string(),
      fwd_account_number: Yup.string(),
      description: Yup.string(),
      phone: Yup.string(),
      email: Yup.string(),
    }),

    onSubmit: (values) => {
      setLoading(true);

      // Clear existing values
      setContractID('');
      setSuccessMessage('');
      setErrorMessage('');

      values.customer_yaya_account = selectedUser;
      authAxios
        .post('/bill/create', values)
        .then((res) => {
          setContractID(res.data.contract_id);
          setLoading(false);

          // clear input fields
          formik.resetForm();
        })
        .catch((error) => {
          setErrorMessage(error.response?.data.message || error.message), setLoading(false);
        });
    },
  });

  return (
    <div className="page-container">
      <h1 className="text-2xl font-semibold p-2 mb-5">Create Bill</h1>

      {errorMessage && <InlineNotification type="error" info={errorMessage} />}

      {(contractID || successMessage) && (
        <InlineNotification
          type="success"
          customType="Uploaded"
          info={`${successMessage ? successMessage : `Contract ID: ${contractID}`}`}
        />
      )}

      <div className="border border-b-0 rounded-t-xl p-2 px-5 max-w-[var(--form-width)] mx-auto bg-gray-50">
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
            <label htmlFor="oneInput" className="cursor-pointer">
              Single Contract
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
            <label htmlFor="multipleInput" className="cursor-pointer">
              Multiple Contracts
            </label>
          </button>
        </div>
      </div>

      {inputFormType === 'one' ? (
        <form
          className="max-w-[var(--form-width)] border p-8 pt-6 rounded-b-xl mx-auto mb-20"
          onSubmit={formik.handleSubmit}
        >
          <div className="grid gap-6 mb-68 md:grid-cols-5">
            <div className="col-span-3">
              <label
                htmlFor="customer_yaya_account"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Customer yaya account
                <span className="font-normal text-gray-400">&nbsp;(optional)</span>
              </label>
              <input
                type="text"
                id="customer_yaya_account"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="customer_yaya_account"
                onChange={formik.handleChange}
                value={formik.values.customer_yaya_account}
              />

              <SearchUserInline
                query={formik.values.customer_yaya_account}
                onSelecteUser={(value) => setSelectedUser(value)}
                onUserNotFound={(value) => setUserNotFound(value)}
              />
            </div>

            <div className="col-span-2">
              <label
                htmlFor="customer_id"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Customer ID
              </label>
              <input
                type="text"
                id="customer_id"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="customer_id"
                onChange={formik.handleChange}
                value={formik.values.customer_id}
              />
              <span className="text-sm text-red-600">
                {formik.touched.customer_id && formik.errors.customer_id}
              </span>
            </div>
          </div>

          <div className="grid gap-6 mb-6 md:grid-cols-3">
            <div>
              <label
                htmlFor="amount"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Amount
              </label>
              <input
                type="number"
                id="amount"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Amount"
                onChange={formik.handleChange}
                value={formik.values.amount}
              />
              <span className="text-sm text-red-600">
                {formik.touched.amount && formik.errors.amount}
              </span>
            </div>

            <div>
              <label
                htmlFor="start_at"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Start date
                <span className="font-normal text-gray-400">&nbsp;(optional)</span>
              </label>
              <input
                type="datetime-local"
                id="start_at"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={formik.handleChange}
                value={formik.values.start_at}
              />
              <span className="text-sm text-red-600">
                {formik.touched.start_at && formik.errors.start_at}
              </span>
            </div>

            <div>
              <label
                htmlFor="due_at"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Due date
              </label>
              <input
                type="datetime-local"
                id="due_at"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={formik.handleChange}
                value={formik.values.due_at}
              />
              <span className="text-sm text-red-600">
                {formik.touched.due_at && formik.errors.due_at}
              </span>
            </div>

            <div>
              <label
                htmlFor="bill_id"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Bill ID
              </label>
              <input
                type="text"
                id="bill_id"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="bill_id"
                onChange={formik.handleChange}
                value={formik.values.bill_id}
              />
              <span className="text-sm text-red-600">
                {formik.touched.bill_id && formik.errors.bill_id}
              </span>
            </div>

            <div>
              <label
                htmlFor="bill_code"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Bill code
                <span className="font-normal text-gray-400">&nbsp;(optional)</span>
              </label>
              <input
                type="text"
                id="bill_code"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="bill_code"
                onChange={formik.handleChange}
                value={formik.values.bill_code}
              />
              <span className="text-sm text-red-600">
                {formik.touched.bill_code && formik.errors.bill_code}
              </span>
            </div>

            <div>
              <label
                htmlFor="bill_season"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Bill season
                <span className="font-normal text-gray-400">&nbsp;(optional)</span>
              </label>
              <input
                type="text"
                id="bill_season"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="bill_season"
                onChange={formik.handleChange}
                value={formik.values.bill_season}
              />
              <span className="text-sm text-red-600">
                {formik.touched.bill_season && formik.errors.bill_season}
              </span>
            </div>

            <div>
              <label
                htmlFor="fwd_institution"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Forward institution
                <span
                  className={`font-normal text-gray-400 ${formik.values.fwd_account_number ? 'hidden' : ''}`}
                >
                  &nbsp;(optional)
                </span>
              </label>
              <input
                type="text"
                id="fwd_institution"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="fwd_institution"
                onChange={formik.handleChange}
                value={formik.values.fwd_institution}
              />
              <span className="text-sm text-red-600">
                {formik.touched.fwd_institution && formik.errors.fwd_institution}
              </span>
            </div>

            <div>
              <label
                htmlFor="fwd_account_number"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Forward account number
                <span
                  className={`font-normal text-gray-400 ${formik.values.fwd_institution ? 'hidden' : ''}`}
                >
                  &nbsp;(optional)
                </span>
              </label>
              <input
                type="text"
                id="fwd_account_number"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="fwd_account_number"
                onChange={formik.handleChange}
                value={formik.values.fwd_account_number}
              />
              <span className="text-sm text-red-600">
                {formik.touched.fwd_account_number && formik.errors.fwd_account_number}
              </span>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Description
                <span className="font-normal text-gray-400">&nbsp;(optional)</span>
              </label>
              <input
                type="text"
                id="description"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="description"
                onChange={formik.handleChange}
                value={formik.values.description}
              />
              <span className="text-sm text-red-600">
                {formik.touched.description && formik.errors.description}
              </span>
            </div>
          </div>

          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Phone number
                <span className="font-normal text-gray-400">&nbsp;(optional)</span>
              </label>
              <input
                type="text"
                id="phone"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="phone"
                autoComplete="tel"
                onChange={formik.handleChange}
                value={formik.values.phone}
              />
              <span className="text-sm text-red-600">
                {formik.touched.phone && formik.errors.phone}
              </span>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Email
                <span className="font-normal text-gray-400">&nbsp;(optional)</span>
              </label>
              <input
                type="text"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="email"
                autoComplete="email"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              <span className="text-sm text-red-600">
                {formik.touched.email && formik.errors.email}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-[200px] px-5 py-2.5 text-center dark:bg-violet-600 dark:hover:bg-violet-700 dark:focus:ring-violet-800"
          >
            <span className="text-[15px]" style={{ letterSpacing: '0.5px' }}>
              {isLoading ? 'Please wait...' : 'Create Bill'}
            </span>
          </button>
        </form>
      ) : (
        <BulkImport
          isLoading={isLoading}
          apiEndpoint="recurring-contract/bulk-import-contract"
          templateFile={'CreateBillTemplate'}
          onLoading={handleOnLoading}
          onError={handleOnError}
          onSuccess={handleOnSuccess}
        />
      )}
    </div>
  );
};

export default CreateBill;
