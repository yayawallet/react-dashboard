import { useState } from 'react';
import BreadCrumbs from './BreadCrumbs';
import UserSettings from '../UserSettings';
import avater from '../../assets/avater.svg';

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-header shadow-sm">
      <header className="relative flex justify-between px-4 md:px-8 h-full">
        <div className="self-end ms-10 lg:ms-0 pb-1 hidden sm:block">
          <BreadCrumbs />
        </div>

        <button
          className="h-full w-full flex items-center justify-end mt-1"
          onBlur={() => setOpen(false)}
        >
          <img
            src={avater}
            alt=""
            className="h-full p-4 cursor-pointer"
            onClick={() => setOpen(!open)}
          />

          <div className={`${open ? '' : 'hidden'}`}>
            <UserSettings />
          </div>
        </button>
      </header>
    </div>
  );
};

export default Header;
