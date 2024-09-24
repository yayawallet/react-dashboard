import { useOutlet, Link } from 'react-router-dom';
import faydaLogo from '../../assets/fayda-logo.png';

const RegistrationMethod = () => {
  const outlet = useOutlet();

  return (
    <div>
      {outlet || (
        <div>
          <div className="border border-b-0 rounded-t-xl p-2 px-5 max-w-[var(--form-width)] mx-auto bg-gray-50 mt-6">
            <h3 className="py-2 text-center text-gray-900 text-lg font-semibold">
              Create New Account
            </h3>
          </div>

          <div className="flex flex-col gap-y-10 justify-center gap-x-20 max-w-[var(--form-width)] border p-8 rounded-b-xl mx-auto mb-20">
            <div className="flex flex-col gap-y-4 items-center justify-center">
              <Link to="phone-number" className="w-full text-center">
                <button className="h-12 text-white bg-yayaBrand-700 hover:bg-yayaBrand-800 focus:ring-4 focus:outline-none focus:ring-yayaBrand-300 font-medium text-[15px] rounded-full w-full sm:w-[280px] px-5 py-2.5 text-centerm">
                  Phone Number
                </button>
              </Link>

              <Link to="national-id" className="w-full text-center">
                <button className="p-0 text-white bg-yayaBrand-700 hover:bg-yayaBrand-800 focus:ring-4 focus:outline-none focus:ring-yayaBrand-300 font-medium rounded-full w-full sm:w-[280px] text-center">
                  <img src={faydaLogo} className="inline-block h-12" alt="National ID" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationMethod;
