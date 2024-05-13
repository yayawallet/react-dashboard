import { useEffect, useState } from 'react';
import axios from 'axios';
import ConfirmModal from './ConfirmModal';
import LoadingModal from './LoadingModal';
import InfoCard from './InfoCard';
import { ScheduledPayment } from '../../../models';

const List = () => {
  const [scheduledPaymentList, setScheduledPaymentList] = useState<
    ScheduledPayment[]
  >([]);
  const [copiedID, setCopiedID] = useState('');
  const [archiveID, setArchiveId] = useState('');
  const [openInfoCard, setOpenInfoCard] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/scheduled-payment/list`)
      .then((res) => {
        setScheduledPaymentList(res.data);
      });
  }, []);

  const handleOnConfirm = (confirm: boolean) => {
    setOpenModal(false);
    if (!confirm) return;

    setIsProcessing(true);
    setSuccessMessage('');
    axios
      .get(
        `${import.meta.env.VITE_BASE_URL}/scheduled-payment/archive/${archiveID}`
      )
      .then(() => {
        setSuccessMessage('Scheduled Payment Archived Successfully');
        setScheduledPaymentList((prev) =>
          prev.filter((l) => l.id != archiveID)
        );
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
      <InfoCard
        openModal={openInfoCard}
        onCloseModal={handleCloseInfoCard}
        successMessage={successMessage}
      />
      <LoadingModal loading={isProcessing} />
      <ConfirmModal openModal={openModal} onConfirm={handleOnConfirm} />

      <div className="mt-2 overflow-x-auto">
        <table className="w-full max-w-[1536px]">
          <thead>
            <tr className="bg-violet-500 text-gray-50">
              <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                ID
              </th>
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
                Status
              </th>
              <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                Next Run-time
              </th>
              <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                Institution
              </th>
              <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {scheduledPaymentList.map((item) => (
              <tr key={item.id} className="hover:bg-gray-100">
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
                  <span
                    className="text-gray-500 text-xs block"
                    style={{ marginTop: '-3px' }}
                  >
                    {'@' + item.receiver.account}
                  </span>
                </td>
                <td className="border-t border-b border-slate-200 p-3">
                  <span className="inline-block ml-3 text-red-600">
                    &#8722;&nbsp;
                  </span>
                  {item.amount}
                </td>
                <td className="border-t border-b border-slate-200 p-3">
                  {item.recurring_type}
                </td>
                <td className="border-t border-b border-slate-200 p-3">
                  {item.status}
                </td>
                <td className="border-t border-b border-slate-200 p-3">
                  {`${new Date(Number(item.next_run_time) * 1000).toLocaleString()}`}
                </td>
                <td className="border-t border-b border-slate-200 p-3">
                  {item.receiver_institution.name}
                </td>
                <td className="border-t border-b border-slate-200 p-3">
                  <button
                    className="text-sm bg-red-600 text-white py-1 px-3 rounded"
                    onClick={() => {
                      setArchiveId(item.id);
                      setOpenModal(true);
                    }}
                  >
                    Archive
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default List;
