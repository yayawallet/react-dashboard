import BackButton from '../components/ui/BackButton';

const NotFound = () => {
  return (
    <div className="page-container">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-2 text-4xl font-semijbold lg:text-6xl text-yaya-800">404</h1>
          <p className="mb-16 text-base  text-gray-700 md:text-xl">Page Not Found</p>

          <BackButton gotoPath={'/'} displayText="Home Page" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
