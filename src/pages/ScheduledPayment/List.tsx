import { useEffect, useState } from 'react';
import axios from 'axios';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import ProcessingModal from '../../components/modals/ProcessingModal';
import ResultModal from '../../components/modals/ResultModal';
import { ScheduledPayment } from '../../models';
import useAccessToken from '../../hooks/useAccessToken';
import PageLoading from '../../components/ui/PageLoading';

const List = () => {
  const [scheduledPaymentList, setScheduledPaymentList] = useState<ScheduledPayment[]>([]);
  const [copiedID, setCopiedID] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduledPayment>();
  const [openInfoCard, setOpenInfoCard] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { accessToken } = useAccessToken();

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/scheduled-payment/list`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        setScheduledPaymentList(res.data);
      });
  }, [accessToken]);

  const handleOnConfirm = (confirm: boolean) => {
    setOpenModal(false);
    if (!confirm) return;

    setIsProcessing(true);
    setSuccessMessage('');
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/scheduled-payment/archive/${selectedSchedule?.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(() => {
        setSuccessMessage('Scheduled Payment Deleted Successfully');
        setScheduledPaymentList((prev) => prev.filter((l) => l.id != selectedSchedule?.id));
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

      {scheduledPaymentList.length === 0 ? (
        <PageLoading />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-violet-500 text-gray-50">
                <th className="border-t border-b border-slate-100 text-left p-3 font-medium">ID</th>
                <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                  Receiver
                </th>
                <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                  Amount
                </th>
                <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                  Recurring
                </th>
                <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                  Next Run-time
                </th>
                <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {scheduledPaymentList.map((item) => (
                <tr key={item.id} className="hover:bg-gray-100 text-nowrap">
                  <td
                    title={item.id}
                    className="relative border-t border-b border-slate-200 p-3"
                    onClick={() => copySchedulePaymentId(item.id)}
                  >
                    {`${item.id.slice(0, 4)}...${item.id.slice(-2)}`}
                    <span
                      className={`${copiedID === item.id ? '' : 'hidden'} absolute -top-2 left-4 w-40 text-center text-white bg-black opacity-70 text-sm px-3 py-1 rounded-lg`}
                    >
                      Id Copied
                    </span>
                  </td>

                  <td className="border-t border-b border-slate-200 p-3">
                    {item.receiver.name.split(' ').slice(0, 2).join(' ')}
                    <br />
                    <span className="text-gray-500 text-xs block" style={{ marginTop: '-3px' }}>
                      {'@' + item.receiver.account}
                    </span>
                  </td>
                  <td className="border-t border-b border-slate-200 p-3">
                    {item.amount.toFixed(2)} ETB
                  </td>
                  <td className="border-t border-b border-slate-200 p-3">{item.recurring_type}</td>
                  <td className="border-t border-b border-slate-200 p-3">
                    {`${new Date(Number(item.next_run_time) * 1000).toLocaleString()}`}
                  </td>
                  <td className="border-t border-b border-slate-200 p-3">
                    <button
                      className="text-sm bg-red-600 text-white py-1 px-3 rounded"
                      onClick={() => {
                        setSelectedSchedule(item);
                        setOpenModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default List;
