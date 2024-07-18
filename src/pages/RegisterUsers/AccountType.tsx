import { Link, useOutlet } from 'react-router-dom';

const AccountType = () => {
  const outlet = useOutlet();

  return (
    <div>
      {outlet || (
        <div className="page-container my-20 flex flex-wrap gap-10 items-center justify-center">
          <div className="flex flex-col items-center py-8 px-10 border rounded-lg">
            <h2 className="text-2xl font-semibold">Select Account Type</h2>
            <ul className="flex flex-col flex-wrap justify-center gap-5 mt-10">
              <li className="border border-blue-100 text-center rounded text-blue-700 hover:bg-slate-50">
                <Link to="/register-user/level-two" className="inline-block py-2 px-6 w-full">
                  Level-two Account
                </Link>
              </li>

              <li className="border border-blue-100 text-center rounded text-blue-700 hover:bg-slate-50">
                <Link to="/register-user/business" className="inline-block py-2 px-6 w-full">
                  Business Account
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountType;
