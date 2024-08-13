import { Link, useOutlet } from 'react-router-dom';
import { sidebarNavs } from '../routing/navigation';
import yayaBrank from '../assets/yayawallet-brand.svg';
import { IoChevronForward } from 'react-icons/io5';

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
          <h3 className="text-2xl font-semibold p-2 mb-10">
            {parentPath.replace('-', ' ').replace(/\b\w{1}/g, (match) => match.toUpperCase())} Menus
          </h3>

          <div className="flex flex-wrap gap-x-56 gap-y-4 items-center md:px-10">
            <ul className="flex flex-col flex-wrap justify-center gap-5">
              {menus?.map((menu) => (
                <li key={menu.path} className="md:min-w-[280px]">
                  <Link
                    to={menu.path}
                    className="flex gap-x-5 justify-between bg-gray-100 rounded py-3 px-4 text-gray-800 hover:text-gray-900 hover:bg-gray-200"
                  >
                    <span>{menu.title}</span>
                    <span className="text-lg">
                      <IoChevronForward />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="absolute bottom-5 left-[50vw]">
            <img src={yayaBrank} width={'120px'} alt="" />
          </div>
        </div>
      )}
    </>
  );
};

export default IndexPage;
