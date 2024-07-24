import { useState } from 'react';
import { authAxios } from '../../api/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import SearchUserInline from '../../components/SearchUserInline';
import { BillListType } from '../../models';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import ProcessingModal from '../../components/modals/ProcessingModal';
import InputUserIconPlaceholder from '../../components/ui/InputUserIconPlaceholder';
import ResultModal from '../../components/modals/ResultModal';

interface Props {
  bill: BillListType | null;
  openUpdateModal: boolean;
  onCancelUpdate: (status: boolean) => void;
}

const UpdateModal = ({ bill, openUpdateModal, onCancelUpdate }: Props) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [openInfoCard, setOpenInfoCard] = useState(false);
  const [updateSucceed, setUpdateSucceed] = useState(false);

  const formik = useFormik({
    initialValues: {
      client_yaya_account: bill?.client_yaya_account?.account || '',
      customer_yaya_account: bill?.customer_yaya_account?.account || '',
      customer_id: bill?.customer_id || '',
      bill_id: bill?.bill_id || '',
      bill_code: bill?.bill_code || '',
      bill_season: bill?.bill_season || '',
      amount: bill?.amount || '',
      start_at: bill?.start_at ? new Date(bill.start_at).toISOString().slice(0, 16) : '',
      due_at: bill?.due_at ? new Date(bill.due_at).toISOString().slice(0, 16) : '',
      cluster: bill?.cluster || '',
      description: bill?.description || '',
      phone: bill?.phone || '',
      email: bill?.email || '',
    },

    enableReinitialize: true,

    validationSchema: Yup.object({
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
      // Clear existing values
      setSuccessMessage('');

      authAxios
        .post('/bill/update', {
          ...values,
          customer_yaya_account: selectedUser,
          start_at: values.start_at ? new Date(values.start_at).getTime() / 1000 : '',
          due_at: values.due_at ? new Date(values.due_at).getTime() / 1000 : '',
        })
        .then(() => {
          setSuccessMessage('Bill updated successfully');
          setIsProcessing(false);
          setOpenInfoCard(true);
          setUpdateSucceed(true);
        })
        .catch(() => {
          setIsProcessing(false);
          setOpenInfoCard(true);
          setUpdateSucceed(false);
        });
    },
  });

  const handleUpdateBill = (confirm: boolean) => {
    setOpenModal(false);
    if (!confirm) return;

    setIsProcessing(true);
    formik.handleSubmit();
  };

  const handleCloseResultModal = () => {
    setOpenInfoCard(false);
    onCancelUpdate(updateSucceed);
  };

  return (
    <div className={`page-container ${openUpdateModal ? '' : 'hidden'}`}>
      <ConfirmationModal
        header="Are you sure you want to update?"
        openModal={openModal}
        onConfirm={handleUpdateBill}
      />
      <ProcessingModal isProcessing={isProcessing} />
      <ResultModal
        openModal={openInfoCard}
        onCloseModal={handleCloseResultModal}
        successMessage={successMessage}
      />

      <div
        className={`${openModal || isProcessing || openInfoCard ? 'bg-black/20' : 'bg-black/80'} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-40 justify-center items-center w-full md:inset-0 h-full`}
      >
        <div
          className="absolute top-[50%] left-[50%] bg-white rounded-xl"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <div className="max-w-[var(--form-width)] flex justify-between items-center bg-gray-50 px-8 py-4 rounded-t-xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900">Update Bill</h3>

            <button
              type="button"
              className="text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-[100px] px-5 py-2.5 text-center"
              onClick={() => onCancelUpdate(false)}
            >
              <span className="text-[15px]" style={{ letterSpacing: '0.3px' }}>
                Cancel
              </span>
            </button>
          </div>

          <form
            className={`max-w-[var(--form-width)] p-8 pt-6 rounded-b-xl mx-auto`}
            onSubmit={(e) => {
              e.preventDefault();
              setOpenModal(true);
            }}
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
                <label
                  htmlFor="customer_id"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Customer ID
                </label>
                <input
                  type="text"
                  id="customer_id"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="customer_id"
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
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Bill season
                  <span className="font-normal text-gray-400">&nbsp;(optional)</span>
                </label>
                <input
                  type="text"
                  id="bill_season"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="bill_season"
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
                  onChange={formik.handleChange}
                  value={formik.values.cluster}
                />
                <span className="text-sm text-red-600">
                  {formik.touched.cluster && formik.errors.cluster}
                </span>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Description
                  <span className="font-normal text-gray-400">&nbsp;(optional)</span>
                </label>
                <input
                  type="text"
                  id="description"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="description"
                  autoComplete="off"
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
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                <span className="text-sm text-red-600">
                  {formik.touched.email && formik.errors.email}
                </span>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <button
                type="submit"
                className="text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm sm:w-[200px] px-5 py-2.5 text-center"
              >
                <span className="text-[15px]" style={{ letterSpacing: '0.3px' }}>
                  Update Bill
                </span>
              </button>

              <button
                type="button"
                className="text-violet-700 border-2 border-violet-700 hover:bg-violet-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm sm:w-[100px] px-5 py-2 text-center"
                onClick={() => onCancelUpdate(false)}
              >
                <span className="text-[15px]" style={{ letterSpacing: '0.3px' }}>
                  Cancel
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateModal;
