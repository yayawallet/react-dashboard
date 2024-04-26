import { Link } from 'react-router-dom';
import yayawalletLogo from '../assets/yayawallet-brand.svg';

const Header = () => {
  return (
    <div className="shadow-sm">
      <header className="flex justify-between px-4">
        <Link to="/">
          <img src={yayawalletLogo} width={120} alt="" className="md:hidden" />
        </Link>

        <ul className="flex text-lg ml-auto">
          <li className="hover:bg-blue-50 flex items-center">
            <Link to="/" className="font-semibold text-blue-800 p-4">
              Dashboard
            </Link>
          </li>
        </ul>
      </header>
    </div>
  );
};

export default Header;
