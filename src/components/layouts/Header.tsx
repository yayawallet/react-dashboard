// import { Link } from 'react-router-dom';
import BreadCrumbs from './BreadCrumbs';
import UserSettings from '../UserSettings';
import { useState } from 'react';

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-16 shadow-sm">
      <header className="flex justify-between px-4">
        <div className="self-end">
          <BreadCrumbs />
        </div>

        <ul className="flex text-lg ml-auto">
          <li
            className="hover:bg-blue-50 flex items-center font-semibold text-blue-800 p-4"
            onClick={() => setOpen(!open)}
          >
            {/* <Link to="/" className="font-semibold text-blue-800 p-4"> */}
            YaYa Dashboard
            {/* </Link> */}
          </li>
        </ul>

        <div className={`${open ? '' : 'hidden'}`}>
          <UserSettings />
        </div>
      </header>
    </div>
  );
};

export default Header;
