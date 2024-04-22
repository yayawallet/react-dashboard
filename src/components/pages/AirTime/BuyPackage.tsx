import { useEffect } from 'react';
import axios from 'axios';

const BuyPackage = () => {
  useEffect(() => {
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/airtime/packages`, {
        phone: '+251967',
      })
      .then((res) => console.log(res.data));
  });

  return (
    <div className="flex gap-6">
      <div className="flex flex-col gap-y-2">
        <div className="border-2 rounded-lg bg-violet-600 text-white w-40 p-3 py-5 flex justify-center text-center cursor-pointer">
          <span>One-Birr Package</span>
        </div>
        <div className="border-2 rounded-lg w-40 p-3 py-5 flex justify-center text-center cursor-pointer">
          <span>Good Morning</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="border-2 rounded-lg w-80 p-3 cursor-pointer">
          <span>Voice One hour Package</span>
        </div>
        <div className="border-2 rounded-lg w-80 p-3 cursor-pointer">
          <span>SMS One hour Package For 86 SMS: 1 Birr</span>
        </div>
        <div className="border-2 rounded-lg w-80 p-3 cursor-pointer">
          <span>Voice One hour Package</span>
        </div>
        <div className="border-2 rounded-lg w-80 p-3 cursor-pointer">
          <span>SMS One hour Package For 86 SMS: 1 Birr</span>
        </div>
        <div className="border-2 rounded-lg w-80 p-3 cursor-pointer">
          <span>SMS One hour Package For 86 SMS: 1 Birr</span>
        </div>
        <div className="border-2 rounded-lg w-80 p-3 cursor-pointer">
          <span>SMS One hour Package For 86 SMS: 1 Birr</span>
        </div>
        <div className="border-2 rounded-lg w-80 p-3 cursor-pointer">
          <span>SMS One hour Package For 86 SMS: 1 Birr</span>
        </div>
        <div className="border-2 rounded-lg w-80 p-3 cursor-pointer">
          <span>SMS One hour Package For 86 SMS: 1 Birr</span>
        </div>
        <div className="border-2 rounded-lg w-80 p-3 cursor-pointer">
          <span>SMS One hour Package For 86 SMS: 1 Birr</span>
        </div>
      </div>

      <button className="block mx-auto mt-8 text-white gap-x-2 bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg w-full sm:max-w-56 px-5 py-2 text-center">
        Next
      </button>
    </div>
  );
};

export default BuyPackage;
