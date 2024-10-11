import { NavLink, useLocation } from 'react-router-dom';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useState } from 'react';

type MenuTypes = {
  title: string;
  path: string;
  icon?: JSX.Element;
  element: JSX.Element;
  accessRoles: string[];
  children?: MenuTypes[];
};

interface Props {
  menu: MenuTypes;
  onCloseSidebar: () => void;
}

const SidebarItem = ({ menu, onCloseSidebar }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathName = useLocation().pathname;

  return (
    <li>
      <NavLink
        to={menu.path}
        className={({ isActive }) =>
          `flex items-center p-2 text-gray-800 hover:bg-yaya-50 ${isActive ? 'bg-yaya-600 text-white hover:bg-yaya-700' : ''} ${isActive && isOpen && menu.children?.length ? 'rounded-t-lg shadow shadow-yaya-200' : 'rounded-lg'}`
        }
        onClick={() => {
          pathName.startsWith('/' + menu.path) ? setIsOpen(!isOpen) : setIsOpen(true);
          onCloseSidebar();
        }}
      >
        <span className="text-xl">{menu.icon}</span>
        <span className="flex-1 ms-3">{menu.title}</span>
        {menu.children ? (
          pathName.startsWith('/' + menu.path) && isOpen ? (
            <IoIosArrowUp />
          ) : (
            <IoIosArrowDown />
          )
        ) : undefined}
      </NavLink>

      {menu.children && (
        <ul
          className={`px-4 pt-2 pb-3 rounded-b-xl ${pathName.startsWith('/' + menu.path) && isOpen ? 'bg-white shadow shadow-yaya-200' : 'hidden'}`}
        >
          {menu.children.map((item, index) => (
            <li key={index}>
              <NavLink
                to={`${menu.path}/${item.path}`}
                className={({ isActive }) =>
                  `flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-50 ${isActive ? 'text-gray-900 shadow bg-yaya-50 hover:bg-yaya-50 activeSubmenuItem' : ''}`
                }
                onClick={onCloseSidebar}
              >
                <span className="flex-1 ms-6">{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default SidebarItem;
