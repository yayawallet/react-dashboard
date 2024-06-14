import { useState } from 'react';
import BreadCrumbs from './BreadCrumbs';
import UserSettings from '../UserSettings';
import avater from '../../assets/avater.svg';

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-16 shadow-sm">
      <header className="flex justify-between px-4 md:px-8 h-full">
        <div className="self-end pb-1">
          <BreadCrumbs />
        </div>

        <div
          className="h-full w-full flex items-center justify-end text-lg font-semibold text-violet-800 cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <img src={avater} alt="" className="h-full p-3" />
        </div>

        <div className={`${open ? '' : 'hidden'}`}>
          <UserSettings />
        </div>
      </header>
    </div>
  );
};

export default Header;
