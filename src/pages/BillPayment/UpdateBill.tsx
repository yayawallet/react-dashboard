import { useEffect, useState } from 'react';
import { authAxios } from '../../api/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import SearchUserInline from '../../components/SearchUserInline';
import InlineNotification from '../../components/InlineNotification';
import { BillDetailType } from '../../models';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import ProcessingModal from '../../components/modals/ProcessingModal';
import { useParams } from 'react-router-dom';
import { useGetData } from '../../hooks/useSWR';
import InputUserIconPlaceholder from '../../components/ui/InputUserIconPlaceholder';

const UpdateBill = () => {
  const [billPaymentID, setBillPaymentID] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [foundBill, setFoundBill] = useState<BillDetailType | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: { account: ownAccount } = {} } = useGetData('/user/profile');

  const { bill_id: params_bill_id } = useParams();

  useEffect(() => {
    setSelectedClient(ownAccount);
  }, [ownAccount]);

  const formik1 = useFormik({
    initialValues: {
      client_yaya_account: ownAccount || '',
      bill_id: params_bill_id || '',
    },

    enableReinitialize: true,

    validationSchema: Yup.object({
      client_yaya_account: Yup.string()
        .max(12, 'must be 12 characters')
        .min(12, 'must be 12 characters')
        .required('Required'),
      bill_id: Yup.string().required(),
    }),

    onSubmit: (values) => {
      setLoading(true);

      // Clear existing values
      setErrorMessage('');
      setBillPaymentID('');

      setFoundBill(null);

      authAxios
        .post('/bill/find', { ...values, client_yaya_account: selectedClient })
        .then((res) => {
          setFoundBill(res.data);

          // clear input fields
          formik1.resetForm();
        })
        .catch((error) => {
          setErrorMessage(
            error.response?.data?.error || error.response?.data?.message || error.message
          );
        })
        .finally(() => setLoading(false));
    },
  });

  const formik = useFormik({
    initialValues: {
      client_yaya_account: foundBill?.client_yaya_account || '',
      customer_yaya_account: '',
      customer_id: foundBill?.customer_id || '',
      bill_id: foundBill?.bill_id || '',
      bill_code: foundBill?.bill_code || '',
      bill_season: foundBill?.bill_season || '',
      amount: foundBill?.amount || '',
      start_at: foundBill?.start_at ? new Date(foundBill.start_at).toISOString().slice(0, 16) : '',
      due_at: foundBill?.due_at ? new Date(foundBill.due_at).toISOString().slice(0, 16) : '',
      cluster: foundBill?.cluster || '',
      description: foundBill?.description || '',
      phone: '',
      email: '',
    },

    enableReinitialize: true,

    validationSchema: Yup.object({
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

    onSubmit: () => {
      setOpenModal(true);
    },
  });

  useEffect(() => {
    if (params_bill_id) formik1.handleSubmit();
  }, [params_bill_id]);

  const handleUpdateBill = (confirm: boolean) => {
    setOpenModal(false);
    if (!confirm) return;

    setIsProcessing(true);

    setLoading(true);

    // Clear existing values
    setBillPaymentID('');
    setErrorMessage('');

    const values = formik.values;

    authAxios
      .post('/bill/update', {
        ...values,
        customer_yaya_account: selectedUser || values.customer_yaya_account,
        start_at: values.start_at ? new Date(values.start_at).getTime() / 1000 : '',
        due_at: values.due_at ? new Date(values.due_at).getTime() / 1000 : '',
      })
      .then((res) => {
        setBillPaymentID(res.data.id);
        setFoundBill(null);

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
        setIsProcessing(false);
      });
  };

  return (
    <div className="page-container">
      <ConfirmationModal
        header="Are you sure you want to update?"
        openModal={openModal}
        onConfirm={handleUpdateBill}
      />
      <ProcessingModal isProcessing={isProcessing} />

      <h1 className="text-2xl font-semibold p-2 mb-5">Update Bill</h1>

      {errorMessage && <InlineNotification type="error" info={errorMessage} />}

      {billPaymentID && (
        <InlineNotification
          type="success"
          customType="Updated Successfully"
          info={`Bill ID: ${billPaymentID}`}
        />
      )}

      <div className="max-w-[var(--form-width)] bg-gray-50 border p-8 pt-6 rounded-t-xl mx-auto mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Update Bill</h3>

        <form className="w-full border-0 rounded-xl" onSubmit={formik1.handleSubmit}>
          <div className="grid gap-6 md:grid-cols-3 mb-6">
            <div>
              <div className="relative">
                <InputUserIconPlaceholder />
              </div>

              <input
                type="text"
                id="client_yaya_account"
                className={`${
                  formik1.touched.client_yaya_account && formik1.errors.client_yaya_account
                    ? 'border border-red-500 outline-none'
                    : ''
                } pl-8 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                placeholder="client_yaya_account"
                autoComplete="off"
                maxLength={12}
                disabled={isLoading}
                onChange={(e) => {
                  formik1.handleChange(e);
                  setSelectedClient('');
                }}
                value={formik1.values.client_yaya_account}
              />

              <SearchUserInline
                query={formik1.values.client_yaya_account}
                includeSelf={true}
                accountType="BUSINESS"
                onSelecteUser={(value) => {
                  setSelectedClient(value);
                  formik1.setFieldValue('client_yaya_account', value);
                }}
              />
            </div>

            <div>
              <input
                type="text"
                id="bill_id"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="bill_id"
                autoComplete="off"
                disabled={isLoading}
                onChange={formik1.handleChange}
                value={formik1.values.bill_id}
              />
              <span className="text-sm text-red-600">
                {formik1.touched.bill_id && formik1.errors.bill_id}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="text-white md:col-span-1 self-start bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-[200px] px-5 py-2.5 text-center"
          >
            <span style={{ letterSpacing: '0.3px' }}>
              {isLoading && !foundBill ? 'Please wait...' : 'Find Bill'}
            </span>
          </button>
        </form>
      </div>

      <form
        className={`${foundBill ? '' : 'hidden'} max-w-[var(--form-width)] border border-t-0 p-8 pt-6 rounded-b-xl mx-auto mb-20`}
        onSubmit={formik.handleSubmit}
      >
        <div className="grid gap-6 mb-4 md:grid-cols-5">
          <div className="md:col-span-3">
            <label
              htmlFor="customer_yaya_account"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Customer yaya account
              <span className="font-normal text-gray-400">&nbsp;(optional)</span>
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
              onChange={formik.handleChange}
              value={formik.values.customer_yaya_account}
            />

            <SearchUserInline
              query={formik.values.customer_yaya_account}
              onSelecteUser={(value) => {
                setSelectedUser(value);
                formik.setFieldValue('customer_yaya_account', value);
              }}
            />
          </div>

          <div className="md:col-span-2">
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
              <span className="font-normal text-gray-400">&nbsp;(optional)</span>
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
            </label>
            <input
              type="text"
              id="bill_id"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="bill_id"
              disabled={isLoading}
              onChange={formik.handleChange}
              value={formik.values.bill_id}
              readOnly
            />
            <span className="text-sm text-red-600">
              {formik.touched.bill_id && formik.errors.bill_id}
            </span>
          </div>

          <div>
            <label htmlFor="bill_code" className="block mb-2 text-sm font-medium text-gray-900">
              Bill code
              <span className="font-normal text-gray-400">&nbsp;(optional)</span>
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
              <span className="font-normal text-gray-400">&nbsp;(optional)</span>
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
              <span className="font-normal text-gray-400">&nbsp;(optional)</span>
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
              <span className="font-normal text-gray-400">&nbsp;(optional)</span>
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
              <span className="font-normal text-gray-400">&nbsp;(optional)</span>
            </label>
            <input
              type="text"
              id="phone"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="phone"
              autoComplete="tel"
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
              <span className="font-normal text-gray-400">&nbsp;(optional)</span>
            </label>
            <input
              type="text"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="email"
              autoComplete="email"
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
          className="text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-[200px] px-5 py-2.5 text-center"
        >
          <span className="text-[15px]" style={{ letterSpacing: '0.3px' }}>
            {isLoading ? 'Please wait...' : 'Update Bill'}
          </span>
        </button>
      </form>
    </div>
  );
};

export default UpdateBill;
