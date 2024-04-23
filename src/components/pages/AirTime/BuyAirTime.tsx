import { useState } from 'react';
import Modal from './Modal';

const BuyAirTime = () => {
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [openModal, setOpenModal] = useState(false);

  const definedAmounts = [5, 10, 15, 25, 50, 100, 250, 500, 1000];

  const payForAirTime = () => setOpenModal(true);

  const handleConfirm = () => {
    setOpenModal(false);
  };

  return (
    <div className="border-2 rounded-lg p-5">
      <Modal
        openModal={openModal}
        onConfirm={handleConfirm}
        amount={selectedAmount}
      />
      <h2 className="font-semibold mb-2">Select Denomination</h2>

      <div className="flex flex-wrap gap-4 mb-8 text-xl">
        {definedAmounts.map((amount) => (
          <div
            key={amount}
            className={`flex justify-center items-center border border-violet-200  rounded w-40 p-2 py-5 cursor-pointer ${selectedAmount === amount ? 'bg-violet-100 hover:bg-violet-100 ring-4 ring-violet-300' : 'hover:bg-violet-50'}`}
            onClick={() => setSelectedAmount(amount)}
          >
            <span className="pr-1">{amount}</span>
            <span className="text-sm text-gray-400">(ETB)</span>
          </div>
        ))}
      </div>

      <div className="">
        <h2 className="font-semibold mb-2">Other Amounts</h2>
        <div className="mb-5 relative max-w-lg">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <span>ETB</span>
          </div>
          <input
            type="number"
            id="phone-number"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full ps-12 p-2.5 outline-none"
            placeholder="Enter Amount"
            required
            autoComplete="off"
            onChange={(e) => setSelectedAmount(Number(e.currentTarget.value))}
          />
        </div>
      </div>

      <button
        className="block mx-auto mt-10 text-white gap-x-2 bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg w-full sm:max-w-56 px-5 py-2 text-center"
        disabled={selectedAmount <= 0}
        onClick={payForAirTime}
      >
        Next
      </button>
    </div>
  );
};

export default BuyAirTime;
