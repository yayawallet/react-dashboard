import { Link, Outlet } from 'react-router-dom';
import yayaBrand from '../../assets/yayawallet-brand.svg';

const DefaultHeader = () => {
  return (
    <div className="h-header shadow-sm">
      <header className="h-full flex justify-between px-8">
        <div className="">
          <Link to="/">
            <img src={yayaBrand} alt="" className="h-full p-1.5" />
          </Link>
        </div>

        <ul className="flex ml-auto">
          <li className="hover:bg-slate-50 flex items-end">
            <Link to="/login" className="font-semibold text-blue-900 px-4 py-3">
              Login
            </Link>
          </li>

          <li className="hover:bg-slate-50 flex items-end">
            <Link to="/help-center" className="font-semibold text-blue-900 px-4 py-3">
              Help Center
            </Link>
          </li>

          <li className="hover:bg-slate-50 flex items-end">
            <Link to="/about-yaya" className="font-semibold text-blue-900 px-4 py-3">
              About YaYa
            </Link>
          </li>
        </ul>
      </header>
      <Outlet />
    </div>
  );
};

export default DefaultHeader;
