import { useState } from 'react';
import BreadCrumbs from './BreadCrumbs';
import UserSettings from '../../pages/UserSettingss/UserSettings';
import avater from '../../assets/avater.svg';
import { useAuth } from '../../auth/AuthProvider';
import { capitalize } from 'lodash';

const Header = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const { user_role } = user || {};

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
          <div className="h-full flex items-center" onClick={() => setOpen(!open)}>
            <span className="text-gray-600 font-semibold">{capitalize(user_role)}</span>
            <img src={avater} alt="" className="h-full p-4 cursor-pointer" />
          </div>

          <div className={`${open ? '' : 'hidden'}`}>
            <UserSettings onCloseUserSettings={() => setOpen(false)} />
          </div>
        </button>
      </header>
    </div>
  );
};

export default Header;
