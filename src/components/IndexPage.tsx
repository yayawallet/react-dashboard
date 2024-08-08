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
        <div className="page-container mt-20 flex flex-wrap gap-20 items-center justify-center">
          <div className="flex flex-col items-center py-8 px-10 border rounded-lg">
            <h2 className="text-2xl font-semibold">
              {parentPath.replace('-', ' ').replace(/\b\w{1}/g, (match) => match.toUpperCase())}{' '}
              Menus
            </h2>
            <ul className="flex flex-col flex-wrap justify-center gap-5 mt-10">
              {menus?.map((menu) => (
                <li
                  key={menu.path}
                  className="border border-blue-100 text-center rounded text-blue-700 hover:bg-slate-50"
                >
                  <Link to={menu.path} className="inline-block py-2 px-6 w-full">
                    {menu.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="">
            <img src={yayaBrank} width={'150px'} alt="" />
          </div>
        </div>
      )}
    </>
  );
};

export default IndexPage;
