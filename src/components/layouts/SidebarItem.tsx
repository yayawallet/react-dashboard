import { useState } from 'react';
import { NavLink } from 'react-router-dom';

type Menu = {
  title: string;
  path: string;
  submenuItems?: Menu[];
};

interface Props {
  menu: Menu;
}

const SidebarItem = ({ menu }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <NavLink
        to={menu.path}
        // className={({ isActive }) => (isActive ? 'text-red-600' : 'text-blue-600')}
        className={({ isActive }) =>
          `flex items-center p-2 text-gray-900 rounded-lg ${isActive ? 'bg-gray-200' : ''}`
        }
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex-1 ms-3">{menu.title}</span>
        {menu.submenuItems && <span>~</span>}
      </NavLink>

      {menu.submenuItems && (
        <ul className={`px-4 rounded ${isOpen ? 'bg-gray-100' : 'hidden'}`}>
          {menu.submenuItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center p-2 text-gray-900 rounded-lg ${isActive ? 'bg-slate-200 bg-opacity-50' : ''}`
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
