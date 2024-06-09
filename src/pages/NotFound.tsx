import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="bg-white">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-6xl  font-bold lg:text-8xl text-gray-600">404</h1>
          <p className="mb-2 text-2xl  font-semibold text-gray-700 md:text-3xl">Page not found</p>
          <p className="mb-4 md:text-lg font-normal text-gray-500">
            Oops! The page you are looking for does not exist.
          </p>
          <Link
            to={'/'}
            className="text-sm px-4 py-2 text-center my-4 inline-flex text-white bg-violet-600 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg"
          >
            Back to HomePage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
