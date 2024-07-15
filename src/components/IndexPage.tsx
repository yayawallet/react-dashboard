import { Link, useOutlet } from 'react-router-dom';
import { sidebarNavs } from '../routing/navigation';
import yayaBrank from '../assets/yayawallet-brand.svg';

interface Props {
  parentPath: string;
}

const IndexPage = ({ parentPath }: Props) => {
  const outlet = useOutlet();

  const menus = sidebarNavs.filter((nav) => nav.path === parentPath)[0]?.children;

  return (
    <>
      {outlet || (
        <div className="page-container mt-20 flex flex-wrap gap-x-20 items-center justify-center">
          <div className="flex flex-col items-center py-8 px-10 border rounded-lg">
            <h2 className="text-2xl font-semibold">
              {parentPath.replace('-', ' ').replace(/\b\w{1}/g, (match) => match.toUpperCase())}{' '}
              Menus
            </h2>
            <ul className="flex flex-col flex-wrap justify-center gap-5 mt-10">
              {menus?.map((menu) => (
                <li
                  key={menu.path}
                  className="border border-blue-100 text-center p-2 rounded text-blue-700 hover:bg-slate-50"
                >
                  <Link to={menu.path} className="p-6">
                    {menu.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-72 border bg-gray-50 py-2 px-8 rounded-lg">
            <img src={yayaBrank} alt="" />
          </div>
        </div>
      )}
    </>
  );
};

export default IndexPage;
