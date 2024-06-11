import { Link, useLocation } from 'react-router-dom';

const BreadCrumbs = () => {
  const location = useLocation();

  let currentLink = '';
  const crumbs = location.pathname.split('/').filter((crumb) => crumb !== '');

  return (
    <ol className="flex items-center whitespace-nowrap">
      <li className="inline-flex items-center">
        <Link
          className="flex items-center text-sm text-gray-800 hover:text-blue-600 focus:outline-none focus:text-blue-600"
          to="/"
        >
          <svg
            className="flex-shrink-0 me-3 size-4"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Home
        </Link>
      </li>

      {crumbs.map((crumb) => {
        currentLink += `/${crumb}`;
        return (
          <li className="inline-flex items-center" key={crumb}>
            <Link
              className={`flex items-center text-sm ${crumbs.indexOf(crumb) === crumbs.length - 1 ? 'text-gray-400 cursor-default' : 'text-gray-800 hover:text-blue-600'}`}
              to={currentLink}
            >
              <svg
                className="flex-shrink-0 mx-2 overflow-visible size-4 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6"></path>
              </svg>
              {crumb}
            </Link>
          </li>
        );
      })}
    </ol>
  );
};

export default BreadCrumbs;
