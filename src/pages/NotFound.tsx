import BackButton from '../components/ui/BackButton';

const NotFound = () => {
  return (
    <div className="page-container">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-4xl  font-bold lg:text-6xl text-yayaBrand-700">404</h1>
          <p className="mb-1 text-xl  font-semibold text-gray-700 md:text-xl">Page not found</p>
          <p className="mb-10 font-normal text-gray-600">
            Oops! The page you are looking for does not exist.
          </p>

          <BackButton gotoPath={'/'} displayText="Back to Home" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
