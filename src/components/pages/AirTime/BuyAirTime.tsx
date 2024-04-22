const BuyAirTime = () => {
  return (
    <div className="border-2 rounded-lg p-5">
      <h2 className="font-semibold mb-2">Select Denomination</h2>

      <div className="flex flex-wrap gap-4 mb-8 text-xl">
        <div className="flex justify-center items-center border rounded w-40 p-2 py-5 hover:bg-violet-50 cursor-pointer">
          <span className="pr-1">5</span>
          <span className="text-sm text-gray-400">(ETB)</span>
        </div>
        <div className="flex justify-center items-center border rounded w-40 p-2 py-5 hover:bg-violet-50 cursor-pointer">
          <span className="pr-1">10</span>
          <span className="text-sm text-gray-400">(ETB)</span>
        </div>
        <div className="flex justify-center items-center border rounded w-40 p-2 py-5 hover:bg-violet-50 cursor-pointer">
          <span className="pr-1">15</span>
          <span className="text-sm text-gray-400">(ETB)</span>
        </div>
        <div className="flex justify-center items-center border rounded w-40 p-2 py-5 hover:bg-violet-50 cursor-pointer">
          <span className="pr-1">25</span>
          <span className="text-sm text-gray-400">(ETB)</span>
        </div>
        <div className="flex justify-center items-center border rounded w-40 p-2 py-5 hover:bg-violet-50 cursor-pointer">
          <span className="pr-1">50</span>
          <span className="text-sm text-gray-400">(ETB)</span>
        </div>
        <div className="flex justify-center items-center border rounded w-40 p-2 py-5 hover:bg-violet-50 cursor-pointer">
          <span className="pr-1">100</span>
          <span className="text-sm text-gray-400">(ETB)</span>
        </div>
        <div className="flex justify-center items-center border rounded w-40 p-2 py-5 hover:bg-violet-50 cursor-pointer">
          <span className="pr-1">500</span>
          <span className="text-sm text-gray-400">(ETB)</span>
        </div>
        <div className="flex justify-center items-center border rounded w-40 p-2 py-5 hover:bg-violet-50 cursor-pointer">
          <span className="pr-1">1000</span>
          <span className="text-sm text-gray-400">(ETB)</span>
        </div>
      </div>

      <div className="">
        <h2 className="font-semibold mb-2">Other Amounts</h2>
        <div className="mb-5 relative max-w-lg">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <span>ETB</span>
          </div>
          <input
            type="text"
            id="phone-number"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full ps-12 p-2.5 outline-none"
            placeholder="Enter Amount"
            required
          />
        </div>
      </div>

      <button className="block mx-auto mt-8 text-white gap-x-2 bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg w-full sm:max-w-56 px-5 py-2 text-center">
        Next
      </button>
    </div>
  );
};

export default BuyAirTime;
