import { useState, useEffect } from 'react';
import BuyAirTime from './BuyAirTime';
import BuyPackage from './BuyPackage';
import { useGetData } from '../../hooks/useSWR';

const AirTime = () => {
  const [topupFor, setTopupFor] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('airtime');
  const [errorMessage, setErrorMessage] = useState('');

  const { data: ownProfile } = useGetData('/user/profile');
  const ownPhoneNumber = ownProfile ? ownProfile.phone : '';

  const isValidPhoneNumber = (phoneNumber: string) => {
    return /(^09\d{8}$|^9\d{8}$)/.test(phoneNumber);
  };

  useEffect(() => {
    setErrorMessage('');

    if (topupFor === 'self') {
      setPhoneNumber(ownPhoneNumber);
    } else if (topupFor === 'other' && phoneNumber === ownPhoneNumber) {
      setPhoneNumber('');
    }
  }, [topupFor]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if (phoneNumber) {
      setErrorMessage('');

      timeoutId = setTimeout(() => {
        const isValidPhone = isValidPhoneNumber(phoneNumber);

        setErrorMessage(isValidPhone ? '' : 'Invalid phone number');
      }, 1000);
    } else {
      // Reset state if input is empty
      setErrorMessage('');
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [phoneNumber]);

  return (
    <div className="page-container">
      <h1 className="text-2xl font-semibold mb-5">Top-up Airtime or Package</h1>

      <div className="">
        <div className="border rounded-lg p-2 px-5">
          <div className="flex gap-x-4 my-2 justify-end">
            <button
              className={`flex flex-wrap items-center gap-x-2 focus:ring-4 focus:outline-none focus:ring-yayaBrand-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-1.5 text-center ${topupFor === 'self' ? 'bg-yayaBrand-600 hover:bg-yayaBrand-700 text-white' : 'text-yayaBrand-900 border-2 border-yayaBrand-600 hover:bg-yayaBrand-100'}`}
              onClick={() => setTopupFor('self')}
            >
              <input
                id="topupFor"
                type="radio"
                name="phone-number"
                className="w-4 h-4 cursor-pointer"
                checked={topupFor === 'self'}
                onChange={() => setTopupFor('self')}
              />
              <label htmlFor="topupFor" className="cursor-pointer">
                For Self
              </label>
            </button>

            <button
              className={`flex flex-wrap items-center gap-x-2 focus:ring-4 focus:outline-none focus:ring-yayaBrand-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-1.5 text-center ${topupFor === 'other' ? 'bg-yayaBrand-600 hover:bg-yayaBrand-700 text-white' : 'text-yayaBrand-900 border-2 border-yayaBrand-600 hover:bg-yayaBrand-100'}`}
              onClick={() => setTopupFor('other')}
            >
              <input
                id="forOther"
                type="radio"
                name="phone-number"
                className="w-4 h-4 cursor-pointer"
                checked={topupFor === 'other'}
                onChange={() => setTopupFor('other')}
              />
              <label htmlFor="forOther" className="cursor-pointer">
                For Other
              </label>
            </button>
          </div>

          <div className="relative w-full mb-1">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 text-gray-600 pointer-events-none">
              <span>+251</span>
            </div>
            <input
              type="number"
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.value =
                  target.value[0] === '0' ? target.value.slice(0, 10) : target.value.slice(0, 9);

                setPhoneNumber(target.value);
                setTopupFor('other');
              }}
              id="phone-number"
              autoComplete="off"
              maxLength={10}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-yayaBrand-500 focus:border-yayaBrand-500 block w-full ps-14 p-2.5 outline-none"
              placeholder="Phone number"
              value={topupFor === 'self' ? ownPhoneNumber : phoneNumber}
            />
          </div>
          <span className="block text-red-600 font-medium text-sm pl-10">{errorMessage}</span>
        </div>

        <div className="flex ms-5 gap-x-4 my-4 px-4a mb-10">
          <button
            className={`focus:ring-4 focus:outline-none focus:ring-yayaBrand-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center ${selectedCategory == 'airtime' ? 'text-white bg-yayaBrand-600 hover:bg-yayaBrand-700 ' : 'text-yayaBrand-900 bg-white border-2 border-yayaBrand-600 hover:bg-yayaBrand-100'}`}
            onClick={() => setSelectedCategory('airtime')}
          >
            Buy Air Time
          </button>

          <button
            className={`focus:ring-4 focus:outline-none focus:ring-yayaBrand-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center ${selectedCategory == 'package' ? 'text-white bg-yayaBrand-600 hover:bg-yayaBrand-700 ' : 'text-yayaBrand-900 bg-white border-2 border-yayaBrand-600 hover:bg-yayaBrand-100'}`}
            onClick={() => setSelectedCategory('package')}
          >
            Buy Package
          </button>
        </div>
      </div>

      {selectedCategory == 'airtime' ? (
        <BuyAirTime
          phoneNumber={phoneNumber.startsWith('0') ? phoneNumber.slice(1) : phoneNumber}
          isInvalidNumber={!isValidPhoneNumber(phoneNumber)}
        />
      ) : (
        <BuyPackage
          phoneNumber={phoneNumber.startsWith('0') ? phoneNumber.slice(1) : phoneNumber}
          isInvalidNumber={!isValidPhoneNumber(phoneNumber)}
        />
      )}
    </div>
  );
};

export default AirTime;
