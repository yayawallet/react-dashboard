import { useState } from 'react';
import { authAxios } from '../../api/axios';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import ProcessingModal from '../../components/modals/ProcessingModal';
import InlineNotification from '../../components/InlineNotification';

interface Props {
  phoneNumber: string;
  isInvalidNumber: boolean;
}

const BuyAirTime = ({ phoneNumber, isInvalidNumber }: Props) => {
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const definedAmounts = [5, 10, 15, 25, 50, 100, 250, 500, 1000];

  const handleConfirm = (confirm: boolean) => {
    setOpenConfirmModal(false);
    if (!confirm) return;

    setIsProcessing(true);
    setSuccessMessage('');
    setErrorMessage('');

    authAxios
      .post('/airtime/airtime-request', {
        phone: '+251' + phoneNumber,
        amount: selectedAmount,
      })
      .then(() => {
        setSuccessMessage('Approval Request sent to Approvers.');
      })
      .catch((error) => {
        setErrorMessage(
          error.response?.data?.message || error.response?.data?.error || error.message
        );
      })
      .finally(() => setIsProcessing(false));
  };

  return (
    <div className="border rounded-lg p-5">
      <ConfirmationModal
        openModal={openConfirmModal}
        onConfirm={handleConfirm}
        header={`Are you sure you want to pay ${selectedAmount} Birr?`}
        infoList={[`Ethio Telecom Airtime`, `Service Number: ${phoneNumber}`]}
      />
      <ProcessingModal isProcessing={isProcessing} />

      {errorMessage && <InlineNotification type="error" info={errorMessage} />}
      {successMessage && <InlineNotification type="success" info={successMessage} />}

      <h2 className="font-semibold mb-2">Select Denomination</h2>

      <div
        className="mb-8 text-xl"
        style={{
          display: 'grid',
          gridGap: '20px',
          gridRowGap: '20px',
          gridTemplateColumns: 'repeat(auto-fill, minmax(10rem, 1fr))',
          gridTemplateRows: '1fr',
        }}
      >
        {definedAmounts.map((amount) => (
          <div
            key={amount}
            className={`flex justify-center items-center border border-violet-200 hover:bg-violet-50 rounded p-2 py-5 cursor-pointer ${selectedAmount === amount ? 'ring-4 ring-violet-300' : ''}`}
            onClick={() => {
              setSelectedAmount(amount);
              setErrorMessage('');
            }}
          >
            <span className="pr-1">{amount}</span>
            <span className="text-sm text-gray-500">(ETB)</span>
          </div>
        ))}
      </div>

      <div className="">
        <h2 className="font-semibold mb-2">Other Amounts</h2>
        <div className="relative max-w-lg">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <span>ETB</span>
          </div>
          <input
            type="number"
            min="5"
            step="1"
            id="amount"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full ps-12 p-2.5 outline-none"
            placeholder="Enter Amount"
            required
            autoComplete="off"
            value={selectedAmount != 0 ? selectedAmount : ''}
            onChange={(e) => {
              setSelectedAmount(Number(e.currentTarget.value));
              Number(e.currentTarget.value) < 5
                ? setErrorMessage('Amount cannot be less than 5')
                : Number(e.currentTarget.value) > Math.floor(Number(e.currentTarget.value))
                  ? setErrorMessage('Invalid amount')
                  : setErrorMessage('');
            }}
          />
        </div>
        <span className="block text-red-600 text-sm pl-10">{errorMessage}</span>
      </div>

      <button
        className="block mx-auto mt-10 text-white gap-x-2 bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg w-full sm:max-w-56 px-5 py-2 text-center"
        disabled={selectedAmount <= 0 || isInvalidNumber || Boolean(errorMessage)}
        onClick={() => setOpenConfirmModal(true)}
      >
        Next
      </button>
    </div>
  );
};

export default BuyAirTime;
