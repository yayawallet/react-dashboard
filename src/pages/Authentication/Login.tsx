import LoginForm from './LoginForm';
import yayaLogo from '../../assets/yaya-logo.svg';
import { useAuth } from '../../auth/AuthProvider';
import { Navigate } from 'react-router-dom';

const Login = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:h-[calc(100vh-100px)] lg:py-0">
        <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
          <img className="w-8 h-8 mr-2" src={yayaLogo} alt="logo" />
          YaYa Dashboard
        </a>
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Sign in to your account
            </h1>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
