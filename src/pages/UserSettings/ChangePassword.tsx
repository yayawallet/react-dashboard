import { useFormik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import { authAxios } from '../../api/axios';
import { Link } from 'react-router-dom';
import InlineNotification from '../../components/InlineNotification';
import { SlArrowLeft } from 'react-icons/sl';

const ChangePassword = () => {
  const [isLoading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },

    validationSchema: Yup.object().shape({
      current_password: Yup.string()
        .max(64, 'Invalid Password')
        .required('Enter your current password'),
      new_password: Yup.string()
        .min(6, 'Must be at least 6 characters')
        .max(64, 'Invalid Password')
        .required('Type a new passowrd'),
      confirm_password: Yup.string()
        .oneOf([Yup.ref('new_password'), undefined], 'Passwords must match')
        .required('Confirm your new password'),
    }),

    onSubmit: (values) => {
      setLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      authAxios
        .post('/user/change-password', {
          old_password: values.current_password,
          new_password: values.new_password,
        })
        .then(() => {
          setSuccessMessage('Password changed successfully');
        })
        .catch((error) =>
          setErrorMessage(
            error.response?.data?.error ||
              error.response?.data?.message ||
              'Cannot change your password!!'
          )
        )
        .finally(() => setLoading(false));
    },
  });

  return (
    <div className="page-container">
      <h1 className="text-2xl font-semibold p-2 mb-10">Change Password</h1>

      {errorMessage && <InlineNotification type="error" info={errorMessage} />}
      {successMessage && <InlineNotification type="success" info={successMessage} />}

      <div className="flex justify-center lg:mr-32 mt-20">
        <div className={`${successMessage ? '' : 'hidden'}`}>
          <Link to="/account">
            <button
              type="button"
              className="text-white bg-yayaBrand-700 hover:bg-yayaBrand-800 focus:ring-4 focus:outline-none focus:ring-yayaBrand-300 font-medium rounded-lg w-full sm:w-[120px] px-5 py-2.5 text-center"
            >
              <div
                className="flex items-center justify-center pr-2 gap-x-1"
                style={{ letterSpacing: '0.3px' }}
              >
                <span className="pt-0.5">
                  <SlArrowLeft />
                </span>
                <span className="">BACK</span>
              </div>
            </button>
          </Link>
        </div>

        <form
          className={`${successMessage ? 'hidden' : ''} w-full md:w-96 p-4 space-y-4 md:space-y-6`}
          onSubmit={formik.handleSubmit}
        >
          <div>
            <label
              htmlFor="current_password"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Current Password
            </label>
            <input
              type="password"
              name="current_password"
              id="current_password"
              placeholder="••••••••"
              autoComplete="off"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-yayaBrand-600 focus:border-yayaBrand-600 block w-full p-2.5"
              disabled={isLoading}
              onChange={(e) => {
                formik.handleChange(e);
                setErrorMessage('');
              }}
              value={formik.values.current_password}
            />

            <span className="text-sm text-red-600">
              {formik.touched.current_password && formik.errors.current_password}
            </span>
          </div>

          <div>
            <input
              type="password"
              name="new_password"
              id="new_password"
              placeholder="New Password"
              autoComplete="off"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-yayaBrand-600 focus:border-yayaBrand-600 block w-full p-2.5"
              disabled={isLoading}
              onChange={(e) => {
                formik.handleChange(e);
                setErrorMessage('');
              }}
              value={formik.values.new_password}
            />

            <span className="text-sm text-red-600">
              {formik.touched.new_password && formik.errors.new_password}
            </span>
          </div>

          <div>
            <input
              type="password"
              name="confirm_password"
              id="confirm_password"
              placeholder="Confirm Password"
              autoComplete="off"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-yayaBrand-600 focus:border-yayaBrand-600 block w-full p-2.5"
              disabled={isLoading}
              onChange={(e) => {
                formik.handleChange(e);
                setErrorMessage('');
              }}
              value={formik.values.confirm_password}
            />

            <span className="text-sm text-red-600">
              {formik.touched.confirm_password && formik.errors.confirm_password}
            </span>
          </div>

          <button
            type="submit"
            className="w-full text-white bg-yayaBrand-600 hover:bg-yayaBrand-700 focus:ring-4 focus:outline-none focus:ring-yayaBrand-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
