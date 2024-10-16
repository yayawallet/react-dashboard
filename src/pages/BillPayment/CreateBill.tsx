import { useEffect, useState } from 'react';
import { authAxios } from '../../api/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import BulkImport from '../../components/BulkImport';
import SearchUserInline from '../../components/SearchUserInline';
import InlineNotification from '../../components/InlineNotification';
import createBillTemplate from '../../assets/bulk-import-templates/create_create-bill_template.xlsx';
import InputUserIconPlaceholder from '../../components/ui/InputUserIconPlaceholder';
import { useGetData } from '../../hooks/useSWR';

const CreateBill = () => {
  const [billPaymentID, setBillPaymentID] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [inputFormType, setInputFormType] = useState('single'); // single or multiple

  const { data: { account: ownAccount } = {} } = useGetData('/user/profile');

  const handleOnLoading = (value: boolean) => setLoading(value);
  const handleOnError = (value: string) => setErrorMessage(value);
  const handleOnSuccess = (value: string) => setSuccessMessage(value);

  useEffect(() => {
    setSelectedClient(ownAccount);
  }, [ownAccount]);

  const formik = useFormik({
    initialValues: {
      client_yaya_account: ownAccount || '',
      customer_yaya_account: '',
      customer_id: '',
      bill_id: '',
      bill_code: '',
      bill_season: '',
      amount: '',
      start_at: '',
      due_at: '',
      cluster: '',
      description: '',
      phone: '',
      email: '',
    },

    enableReinitialize: true,

    validationSchema: Yup.object({
      client_yaya_account: Yup.string()
        .max(12, 'must be 12 characters')
        .min(12, 'must be 12 characters')
        .required('Required'),
      customer_yaya_account: Yup.string(),
      amount: Yup.number().required('Amount is required').min(1, 'Amount cannot be less than 1.00'),
      start_at: Yup.date(),
      due_at: Yup.date()
        .required('Due date is required')
        .test('due_at', 'Due date must be in the future', (value) => {
          return new Date(value).getTime() > new Date().getTime() + 60000; // 60000 == 1 minutes
        }),
      customer_id: Yup.string(),
      bill_id: Yup.string().required('Bill ID is required'),
      bill_code: Yup.string(),
      bill_season: Yup.string(),
      cluster: Yup.string(),
      description: Yup.string(),
      phone: Yup.string().matches(
        /(^\+?251\d{9}$)|(^0(9|7)\d{8}$|^9\d{8}$)/, // Ethiopian phone number
        'Phone number is not valid'
      ),
      email: Yup.string().email('Invalid email address'),
    }),

    onSubmit: (values) => {
      setLoading(true);

      // Clear existing values
      setBillPaymentID('');
      setSuccessMessage('');
      setErrorMessage('');

      authAxios
        .post('/bill/create', {
          ...values,
          client_yaya_account: selectedClient || values.client_yaya_account,
          customer_yaya_account: selectedCustomer || values.customer_yaya_account,
          start_at: values.start_at ? new Date(values.start_at).getTime() / 1000 : '',
          due_at: values.due_at ? new Date(values.due_at).getTime() / 1000 : '',
          phone: values.phone?.toString(),
        })
        .then((res) => {
          setBillPaymentID(res.data.id);

          // clear input fields
          formik.resetForm();
        })
        .catch((error) => {
          setErrorMessage(
            error.response?.data?.error || error.response?.data?.message || error.message
          );
        })
        .finally(() => {
          setLoading(false);
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        });
    },
  });

  return (
    <div className="page-container">
      <h1 className="text-2xl font-semibold p-2 mb-5">Create Bill</h1>

      {errorMessage && <InlineNotification type="error" info={errorMessage} />}

      {billPaymentID && (
        <InlineNotification
          type="success"
          info={`${successMessage ? successMessage : `Bill Payment ID: ${billPaymentID}`}`}
        />
      )}

      {successMessage && (
        <InlineNotification
          type="success"
          customType="Uploaded"
          info={`${successMessage ? successMessage : `Bill Payment ID: ${billPaymentID}`}`}
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
              Single Bill
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
              Multiple Bills
            </label>
          </button>
        </div>
      </div>

      {inputFormType === 'single' ? (
        <form
          className="max-w-[var(--form-width)] border p-8 pt-6 rounded-b-xl mx-auto mb-20"
          onSubmit={formik.handleSubmit}
          autoComplete="off"
        >
          <div className="grid gap-6 mb-6 md:grid-cols-3">
            <div>
              <label
                htmlFor="client_yaya_account"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Client yaya account
                <span className="block text-sm text-red-600">
                  {formik.touched.client_yaya_account &&
                    formik.errors.client_yaya_account?.toString()}
                </span>
              </label>

              <div className="relative">
                <InputUserIconPlaceholder />
              </div>

              <input
                type="text"
                id="client_yaya_account"
                className="pl-8 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="client_yaya_account"
                autoComplete="off"
                maxLength={12}
                disabled={isLoading}
                onChange={(e) => {
                  formik.handleChange(e);
                  setSelectedClient('');
                }}
                value={formik.values.client_yaya_account}
              />

              <SearchUserInline
                query={formik.values.client_yaya_account}
                includeSelf={true}
                accountType="BUSINESS"
                onSelecteUser={(value) => {
                  setSelectedClient(value);
                  formik.setFieldValue('client_yaya_account', value);
                }}
              />
            </div>

            <div>
              <label
                htmlFor="customer_yaya_account"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Customer yaya account
              </label>

              <div className="relative">
                <InputUserIconPlaceholder />
              </div>

              <input
                type="text"
                id="customer_yaya_account"
                className="pl-8 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="customer_yaya_account"
                autoComplete="off"
                maxLength={12}
                disabled={isLoading}
                onChange={(e) => {
                  formik.handleChange(e);
                  setSelectedCustomer('');
                }}
                value={formik.values.customer_yaya_account}
              />

              <SearchUserInline
                query={formik.values.customer_yaya_account}
                onSelecteUser={(value) => {
                  setSelectedCustomer(value);
                  formik.setFieldValue('customer_yaya_account', value);
                }}
              />
            </div>

            <div>
              <label htmlFor="customer_id" className="block mb-2 text-sm font-medium text-gray-900">
                Customer ID
              </label>
              <input
                type="text"
                id="customer_id"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="customer_id"
                disabled={isLoading}
                onChange={formik.handleChange}
                value={formik.values.customer_id}
              />
              <span className="text-sm text-red-600">
                {formik.touched.customer_id && formik.errors.customer_id}
              </span>
            </div>
          </div>

          <div className="grid gap-8 mb-8 md:grid-cols-3">
            <div>
              <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900">
                Amount
                <span className="font-normal text-gray-400">&nbsp;&nbsp;(Required)</span>
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

            <div>
              <label htmlFor="start_at" className="block mb-2 text-sm font-medium text-gray-900">
                Start date
              </label>
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

            <div>
              <label htmlFor="due_at" className="block mb-2 text-sm font-medium text-gray-900">
                Due date
                <span className="font-normal text-gray-400">&nbsp;&nbsp;(Required)</span>
              </label>
              <input
                type="datetime-local"
                name="due_at"
                id="due_at"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                disabled={isLoading}
                value={formik.values.due_at}
                onChange={formik.handleChange}
              />
              <span className="text-sm text-red-600">
                {formik.touched.due_at && formik.errors.due_at}
              </span>
            </div>

            <div>
              <label htmlFor="bill_id" className="block mb-2 text-sm font-medium text-gray-900">
                Bill ID
                <span className="font-normal text-gray-400">&nbsp;&nbsp;(Required)</span>
              </label>
              <input
                type="text"
                id="bill_id"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="bill_id"
                disabled={isLoading}
                onChange={formik.handleChange}
                value={formik.values.bill_id}
              />
              <span className="text-sm text-red-600">
                {formik.touched.bill_id && formik.errors.bill_id}
              </span>
            </div>

            <div>
              <label htmlFor="bill_code" className="block mb-2 text-sm font-medium text-gray-900">
                Bill code
              </label>
              <input
                type="text"
                id="bill_code"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="bill_code"
                disabled={isLoading}
                onChange={formik.handleChange}
                value={formik.values.bill_code}
              />
              <span className="text-sm text-red-600">
                {formik.touched.bill_code && formik.errors.bill_code}
              </span>
            </div>

            <div>
              <label htmlFor="bill_season" className="block mb-2 text-sm font-medium text-gray-900">
                Bill season
              </label>
              <input
                type="text"
                id="bill_season"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="bill_season"
                disabled={isLoading}
                onChange={formik.handleChange}
                value={formik.values.bill_season}
              />
              <span className="text-sm text-red-600">
                {formik.touched.bill_season && formik.errors.bill_season}
              </span>
            </div>
          </div>

          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label htmlFor="cluster" className="block mb-2 text-sm font-medium text-gray-900">
                Cluster
              </label>
              <input
                type="text"
                id="cluster"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="cluster"
                disabled={isLoading}
                onChange={formik.handleChange}
                value={formik.values.cluster}
              />
              <span className="text-sm text-red-600">
                {formik.touched.cluster && formik.errors.cluster}
              </span>
            </div>

            <div>
              <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">
                Description
              </label>
              <input
                type="text"
                id="description"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="description"
                autoComplete="off"
                disabled={isLoading}
                onChange={formik.handleChange}
                value={formik.values.description}
              />
              <span className="text-sm text-red-600">
                {formik.touched.description && formik.errors.description}
              </span>
            </div>

            <div>
              <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900">
                Phone number
              </label>
              <input
                type="number"
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.slice(0, 13);
                }}
                id="phone"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="phone"
                autoComplete="off"
                disabled={isLoading}
                onChange={formik.handleChange}
                value={formik.values.phone}
              />
              <span className="text-sm text-red-600">
                {formik.touched.phone && formik.errors.phone}
              </span>
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                Email
              </label>
              <input
                type="text"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="email"
                autoComplete="new-email"
                disabled={isLoading}
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
            className="text-white bg-yaya-700 hover:bg-yaya-800 focus:ring-4 focus:outline-none focus:ring-yaya-300 font-medium rounded-lg text-sm w-full sm:w-[200px] px-5 py-2.5 text-center"
          >
            <span className="text-[15px]" style={{ letterSpacing: '0.3px' }}>
              {isLoading ? 'Please wait...' : 'Create Bill'}
            </span>
          </button>
        </form>
      ) : (
        <BulkImport
          isLoading={isLoading}
          apiEndpoint="bulkimport/bills"
          templateFile={createBillTemplate}
          onLoading={handleOnLoading}
          onError={handleOnError}
          onSuccess={handleOnSuccess}
        />
      )}
    </div>
  );
};

export default CreateBill;
