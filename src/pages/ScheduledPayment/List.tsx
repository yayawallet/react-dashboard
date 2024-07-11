import { useState } from 'react';
import { authAxios } from '../../api/axios';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import ProcessingModal from '../../components/modals/ProcessingModal';
import ResultModal from '../../components/modals/ResultModal';
import { ScheduledPayment } from '../../models';
import { capitalize, formatDate } from '../../utils/table_utils';
import Loading from '../../components/ui/Loading';
import Error from '../../components/ui/Error';
import EmptyList from '../../components/ui/EmptyList';
import { useGetData } from '../../hooks/useSWR';
import RefreshButton from '../../components/ui/RefreshButton';

const List = () => {
  const [copiedID, setCopiedID] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduledPayment>();
  const [openInfoCard, setOpenInfoCard] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    error,
    isLoading,
    data: scheduledPaymentList,
    mutate,
  } = useGetData('/scheduled-payment/list');

  const handleOnConfirm = (confirm: boolean) => {
    setOpenModal(false);
    if (!confirm) return;

    setIsProcessing(true);
    setSuccessMessage('');
    authAxios
      .get(`/scheduled-payment/archive/${selectedSchedule?.id}`)
      .then(() => {
        setSuccessMessage('Scheduled Payment Deleted Successfully');
        // setScheduledPaymentList((prev) => prev.filter((l) => l.id != selectedSchedule?.id));
        setIsProcessing(false);
        setOpenInfoCard(true);
      })
      .catch(() => {
        setIsProcessing(false);
        setOpenInfoCard(true);
      });
  };

  const handleCloseInfoCard = () => setOpenInfoCard(false);

  const copySchedulePaymentId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedID(id);

    setTimeout(() => setCopiedID(''), 1000);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await mutate();
    setIsRefreshing(false);
  };

  return (
    <div className="table-container">
      <ConfirmationModal
        header="Are you sure you want to Delete this schedule?"
        infoList={[
          `Amount: ${selectedSchedule?.amount.toFixed(2)} ETB`,
          `Recurring: ${selectedSchedule?.recurring_type}`,
          `Receiver: ${selectedSchedule?.receiver.name}`,
        ]}
        openModal={openModal}
        onConfirm={handleOnConfirm}
      />
      <ProcessingModal isProcessing={isProcessing} />
      <ResultModal
        openModal={openInfoCard}
        onCloseModal={handleCloseInfoCard}
        successMessage={successMessage}
      />

      {error ? (
        <Error />
      ) : isLoading ? (
        <Loading />
      ) : (
        <div className="border border-slate-200 rounded-xl">
          <div className="flex flex-wrap justify-between items-center m-3">
            <h3 className="py-2 text-lg font-medium">Scheduled Payments</h3>
            <div onClick={handleRefresh}>
              <RefreshButton />
            </div>
          </div>
          {scheduledPaymentList.length === 0 ? (
            <EmptyList />
          ) : (
            <div className="relative">
              <div className={`${isRefreshing ? '' : 'hidden'}`}>
                <div
                  className="absolute z-10 bg-white rounded-full p-1.5"
                  style={{
                    top: '30vh',
                    left: '50%',
                    transform: 'translate(-50%)',
                    boxShadow: '0 0 5px #888',
                  }}
                >
                  <span
                    className="inline-block border-gray-400 h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                  ></span>
                </div>
                <div className="absolute z-20 h-full w-full"></div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left px-4 py-3 font-medium">ID</th>
                      <th className="text-left px-4 py-3 font-medium">Receiver Name</th>
                      <th className="text-left px-4 py-3 font-medium">Receiver Account</th>
                      <th className="text-left px-4 py-3 font-medium">Amount</th>
                      <th className="text-left px-4 py-3 font-medium">Recurring</th>
                      <th className="text-left px-4 py-3 font-medium">Next Run-time</th>
                      <th className="text-left px-4 py-3 font-medium">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {scheduledPaymentList.map((item: ScheduledPayment) => (
                      <tr key={item.id} className="hover:bg-slate-100 text-nowrap">
                        <td
                          title={item.id}
                          className="relative border-b border-slate-200 p-3 cursor-pointer"
                          onClick={() => copySchedulePaymentId(item.id)}
                        >
                          {`${item.id.slice(0, 6)}...${item.id.slice(-2)}`}
                          <span
                            className={`${copiedID === item.id ? '' : 'hidden'} absolute -top-2 left-4 z-10 w-30 text-center text-white bg-black opacity-70 text-sm px-3 py-1 rounded-lg`}
                          >
                            ID Copied
                          </span>
                        </td>

                        <td className="border-b border-slate-200 p-3">
                          {capitalize(item.receiver.name).split(' ').slice(0, 2).join(' ')}
                        </td>
                        <td className="border-b border-slate-200 p-3">
                          <span className="text-gray-500">@{item.receiver.account}</span>
                        </td>
                        <td className="border-b border-slate-200 p-3">
                          {item.amount.toFixed(2)}{' '}
                          <span className="text-gray-500 text-sm">ETB</span>
                        </td>
                        <td className="border-b border-slate-200 p-3">{item.recurring_type}</td>
                        <td className="border-b border-slate-200 p-3">
                          {formatDate(item.next_run_time)}
                        </td>
                        <td className="border-b border-slate-200 p-3">
                          <button
                            className="bg-red-600 text-white pt-0.5 pb-1 px-2 rounded hover:bg-red-700"
                            onClick={() => {
                              setSelectedSchedule(item);
                              setOpenModal(true);
                            }}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default List;
