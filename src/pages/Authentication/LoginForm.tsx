import { useState } from 'react';
import axios from '../../api/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const { login } = useAuth();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },

    validationSchema: Yup.object({
      username: Yup.string()
        .min(4, 'Invalid username')
        .max(64, 'Must be 64 characters or less')
        .required('username is required'),
      password: Yup.string()
        .min(6, 'Password must be atleast 6 characters long')
        .max(64, 'Must be 64 characters or less')
        .required('password is required'),
    }),

    onSubmit: (values) => {
      setIsLoading(true);
      setErrorMessage('');

      axios
        .post('/login', values)
        .then((res) => {
          setSuccess(true);
          setIsLoading(false);
          login(res.data.access, res.data.refresh, res.data.user);
          formik.resetForm();
        })
        .catch(() => {
          setSuccess(false);
          setIsLoading(false);
          setErrorMessage('Incorrect username or password');
          formik.setFieldValue('password', '');
        });
    },
  });

  if (success) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      {errorMessage && (
        <p className="my-2 px-4 py-1 bg-red-50 text-center text-red-600 border-2 border-red-100 rounded">
          {errorMessage}
        </p>
      )}

      <form className="space-y-4 md:space-y-6 py-4" onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900">
            Your username
          </label>
          <input
            type="username"
            name="username"
            id="username"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-yayaBrand-600 focus:border-yayaBrand-600 block w-full p-2.5"
            placeholder="username"
            autoComplete="username"
            disabled={isLoading}
            onChange={(e) => {
              formik.handleChange(e);
              setErrorMessage('');
            }}
            value={formik.values.username}
          />

          <span className="text-sm text-red-600">
            {formik.touched.username && formik.errors.username}
          </span>
        </div>

        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-yayaBrand-600 focus:border-yayaBrand-600 block w-full p-2.5"
            disabled={isLoading}
            onChange={(e) => {
              formik.handleChange(e);
              setErrorMessage('');
            }}
            value={formik.values.password}
          />

          <span className="text-sm text-red-600">
            {formik.touched.password && formik.errors.password}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="remember"
                aria-describedby="remember"
                type="checkbox"
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-yayaBrand-300"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="remember" className="text-gray-500">
                Remember me
              </label>
            </div>
          </div>
          <span
            className="text-sm font-medium text-yayaBrand-600 hover:underline cursor-pointer"
            onClick={() => alert("If you lost your password, please contact the company's Admin.")}
          >
            Forgot password?
          </span>
        </div>
        <button
          type="submit"
          className="w-full text-white bg-yayaBrand-600 hover:bg-yayaBrand-700 focus:ring-4 focus:outline-none focus:ring-yayaBrand-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          disabled={isLoading}
        >
          {isLoading ? 'Please wait...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
