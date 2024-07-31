import { Link, useOutlet } from 'react-router-dom';
import { useContext } from 'react';
import { RegistrationContext } from './Index';

const AccountType = () => {
  const outlet = useOutlet();
  // @ts-ignore
  const { store, setStore } = useContext(RegistrationContext);

  if (store?.accountType === 'level-two' || store?.accountType === 'business') return outlet;

  return (
    <div className="page-container my-20 flex flex-wrap gap-10 items-center justify-center">
      <div className="flex flex-col items-center py-8 px-10 border rounded-lg">
        <h2 className="text-2xl font-semibold">Select Account Type</h2>
        <ul className="flex flex-col flex-wrap justify-center gap-5 mt-10">
          <li className="border border-blue-100 text-center rounded text-blue-700 hover:bg-slate-50">
            <Link
              to="level-two"
              className="inline-block py-2 px-6 w-full"
              onClick={() => setStore({ ...store, accountType: 'level-two' })}
            >
              Level-two Account
            </Link>
          </li>

          <li className="border border-blue-100 text-center rounded text-blue-700 hover:bg-slate-50">
            <Link
              to="business"
              className="inline-block py-2 px-6 w-full"
              onClick={() => setStore({ ...store, accountType: 'business' })}
            >
              Business Account
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AccountType;
