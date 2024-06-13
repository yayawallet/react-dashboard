import { Link, Outlet } from 'react-router-dom';
import UserSettings from '../UserSettings';

const DefaultHeader = () => {
  return (
    <div className="h-16 shadow-sm">
      <header className="h-full flex justify-between px-8">
        <ul className="flex text-lg ml-auto">
          <li className="hover:bg-blue-50 flex items-center">
            <Link to="/" className="font-semibold text-blue-800 p-4">
              YaYa Wallet
            </Link>
          </li>
        </ul>

        <UserSettings />
      </header>
      <Outlet />
    </div>
  );
};

export default DefaultHeader;
