import { useEffect, useState } from 'react';
import BreadCrumbs from './BreadCrumbs';
import UserSettings from '../../pages/UserSettings/UserSettings';
import avater from '../../assets/avater.svg';
import { useAuth } from '../../auth/AuthProvider';
import { capitalize } from 'lodash';
import { useGetData } from '../../hooks/useSWR';
import { BASE_URL } from '../../CONSTANTS';

const Header = () => {
  const [open, setOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState(avater);

  const { user } = useAuth();
  const { user_role } = user || {};

  const { data: userInfo } = useGetData('user/me/');

  useEffect(() => {
    if (userInfo?.profile_image) {
      setImgSrc(BASE_URL + userInfo?.profile_image);
    }
  }, [userInfo]);

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
            <span className="text-gray-600 font-semibold mr-2">{capitalize(user_role)}</span>
            <img
              src={imgSrc}
              alt=""
              onError={() => setImgSrc(avater)}
              className="w-8 h-8 object-cover cursor-pointer rounded-full"
            />
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
