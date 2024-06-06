import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="bg-white">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-6xl  font-bold lg:text-8xl text-violet-600">404</h1>
          <p className="mb-4 text-2xl  font-semibold text-gray-700 md:text-3xl">
            Something's missing.
          </p>
          <p className="mb-4 md:text-lg font-light text-gray-500">
            Sorry, we can't find that page.
          </p>
          <Link
            to={'/'}
            className='className="inline-flex text-white bg-violet-600 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4'
          >
            Back to HomePage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
