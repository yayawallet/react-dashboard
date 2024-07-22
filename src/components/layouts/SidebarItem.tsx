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
          `flex items-center p-2 text-gray-800 hover:bg-white border ${isActive ? 'bg-white' : 'border-transparent'} ${isActive && isOpen ? 'shadow border-transparent border-t-gray-200' : ''} ${isOpen && menu.children?.length ? 'rounded-t-lg' : 'rounded-lg'}`
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
          className={`px-4 pt-2 pb-3 rounded-b ${pathName.startsWith('/' + menu.path) && isOpen ? 'bg-white shadow' : 'hidden'}`}
        >
          {menu.children.map((item, index) => (
            <li key={index}>
              <NavLink
                to={`${menu.path}/${item.path}`}
                className={({ isActive }) =>
                  `flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-50 ${isActive ? 'text-gray-900 shadow border-t activeSubmenuItem' : ''}`
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
