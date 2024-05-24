import { useEffect, useState } from 'react';
import axios from 'axios';
import ConfirmationModal from '../../common/Modals/ConfirmationModal';
import ProcessingModal from '../../common/Modals/ProcessingModal';
import ResultModal from '../../common/Modals/ResultModal';
import { ScheduledPayment } from '../../../models';
import Loading from '../../common/Loading';

const List = () => {
  const [scheduledPaymentList, setScheduledPaymentList] = useState<ScheduledPayment[]>([]);
  const [copiedID, setCopiedID] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduledPayment>();
  const [openInfoCard, setOpenInfoCard] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/scheduled-payment/list`).then((res) => {
      setScheduledPaymentList(res.data);
    });
  }, []);

  const handleOnConfirm = (confirm: boolean) => {
    setOpenModal(false);
    if (!confirm) return;

    setIsProcessing(true);
    setSuccessMessage('');
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/scheduled-payment/archive/${selectedSchedule?.id}`)
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
    <div className="-mx-4">
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

      <div className="mt-2">
        <table className="w-full max-w-[1536px]">
          <thead className="sticky top-0 z-10">
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

          {scheduledPaymentList.length === 0 ? (
            <tbody className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
              <tr>
                <td>
                  <Loading />
                </td>
              </tr>
            </tbody>
          ) : (
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
          )}
        </table>
      </div>
    </div>
  );
};

export default List;
