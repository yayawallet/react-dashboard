import { NavLink, useLocation } from 'react-router-dom';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useState } from 'react';

type MenuTypes = {
  title: string;
  path: string;
  icon?: JSX.Element;
  element: JSX.Element;
  submenuItems?: MenuTypes[];
};

interface Props {
  menu: MenuTypes;
}

const SidebarItem = ({ menu }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const pathName = useLocation().pathname;

  return (
    <li>
      <NavLink
        to={menu.path}
        className={({ isActive }) =>
          `flex items-center p-2 text-gray-900 rounded-lg ${isActive ? 'bg-gray-200' : ''}`
        }
        onClick={() =>
          pathName.startsWith('/' + menu.path) ? setIsOpen(!isOpen) : setIsOpen(true)
        }
      >
        <span className="text-xl text-gray-600">{menu.icon}</span>
        <span className="flex-1 ms-3">{menu.title}</span>
        {menu.submenuItems ? (
          pathName.startsWith('/' + menu.path) && isOpen ? (
            <IoIosArrowUp />
          ) : (
            <IoIosArrowDown />
          )
        ) : undefined}
      </NavLink>

      {menu.submenuItems && (
        <ul
          className={`px-2 rounded ${pathName.startsWith('/' + menu.path) && isOpen ? 'bg-gray-100' : 'hidden'}`}
        >
          {menu.submenuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-2 text-gray-600 rounded-lg ${isActive ? 'text-gray-900' : ''}`
                }
              >
                <span className="flex-1 ms-3">{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default SidebarItem;
