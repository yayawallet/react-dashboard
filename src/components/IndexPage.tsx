import { Link, useOutlet } from 'react-router-dom';
import { sidebarNavs } from '../routing/navigation';

interface Props {
  parentPath: string;
}

const IndexPage = ({ parentPath }: Props) => {
  const outlet = useOutlet();

  const menus = sidebarNavs.filter((nav) => nav.path === parentPath)[0]?.children;

  return (
    <>
      {outlet || (
        <div className="page-container">
          <ul className="flex flex-wrap justify-center gap-5 mt-10">
            {menus?.map((menu) => (
              <li
                key={menu.path}
                className="border border-blue-100 text-center p-4 rounded text-blue-800 hover:text-blue-600 hover:bg-slate-50"
              >
                <Link to={menu.path} className="p-6">
                  {menu.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default IndexPage;
