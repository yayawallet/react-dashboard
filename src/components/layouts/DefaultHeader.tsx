import { Link, Outlet } from 'react-router-dom';
import yaya from '../../assets/yayawallet-brand.svg';

const DefaultHeader = () => {
  return (
    <div className="h-header shadow-sm">
      <header className="h-full flex justify-between px-8">
        <div className="">
          <Link to="/" aria-label="yaya wallet logo">
            <img src={yaya} alt="" className="h-full p-1.5" />
          </Link>
        </div>

        <ul className="flex ml-auto">
          <li className="hover:bg-slate-50 flex items-end">
            <Link to="/login" aria-label="Login" className="font-semibold text-blue-900 px-4 py-3">
              Login
            </Link>
          </li>

          <li className="hover:bg-slate-50 flex items-end">
            <Link
              to="/help-center"
              aria-label="Help Center"
              className="font-semibold text-blue-900 px-4 py-3"
            >
              Help Center
            </Link>
          </li>
        </ul>
      </header>
      <Outlet />
    </div>
  );
};

export default DefaultHeader;
