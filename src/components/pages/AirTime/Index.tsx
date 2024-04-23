// import BuyAirTime from './BuyAirTime';
import { useState } from 'react';
import BuyPackage from './BuyPackage';

const AirTime = () => {
  const [forSelf, setForSelf] = useState(true);

  return (
    <div className="container">
      <h1 className="text-2xl font-semibold p-2 mb-5">Top-up Air Time</h1>

      <div className="">
        <div className="border-2 rounded-lg p-2 px-5">
          <div className="flex gap-x-4 my-2 justify-end">
            <button
              className={`flex flex-wrap items-center gap-x-2 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-1.5 text-center ${forSelf ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'text-violet-900 border-2 border-violet-600 hover:bg-violet-100'}`}
            >
              <input
                id="forSelf"
                type="radio"
                name="phone-number"
                className="w-4 h-4 cursor-pointer"
                defaultChecked={forSelf}
                onClick={() => setForSelf(true)}
              />
              <label htmlFor="forSelf" className="cursor-pointer">
                For Self
              </label>
            </button>

            <button
              className={`flex flex-wrap items-center gap-x-2 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-1.5 text-center ${!forSelf ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'text-violet-900 border-2 border-violet-600 hover:bg-violet-100'}`}
            >
              <input
                id="forOther"
                type="radio"
                name="phone-number"
                className="w-4 h-4 cursor-pointer"
                onClick={() => setForSelf(false)}
              />
              <label htmlFor="forOther" className="cursor-pointer">
                For Other
              </label>
            </button>
          </div>

          <div className="relative w-full mb-1">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <span>+251</span>
            </div>
            <input
              type="text"
              id="phone-number"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full ps-14 p-2.5 outline-none"
              placeholder="Phone number"
              required
            />
          </div>
        </div>

        <div className="flex gap-x-4 my-4 px-4a mb-10">
          <button className="text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center">
            Buy Air Time
          </button>

          <button className="text-violet-900 bg-white border-2 border-violet-600 hover:bg-violet-600 hover:text-white focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center">
            Buy Package
          </button>
        </div>
      </div>

      {/* <BuyAirTime /> */}
      <BuyPackage />
    </div>
  );
};

export default AirTime;
