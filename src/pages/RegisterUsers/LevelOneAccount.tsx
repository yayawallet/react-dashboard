import { useState } from 'react';
import { authAxios } from '../../api/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InlineNotification from '../../components/InlineNotification';
import { EthiopianRegions, worldCountries } from '../../CONSTANTS';
import SelectElement from '../../components/SelectElement';

const LevelOneAccount = () => {
  const [registrationID, setRegistrationID] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      invitation_hash: '',
      fin: '',
      name: '',
      email: '',
      phone: '',
      gender: '',
      date_of_birth: '',
      region: '',
      country: '',
      address: '',
      password: '',
      confirmPassword: '',
      account_name: '',
      photo_base64: '',
      id_front_base64: '',
      id_back_base64: '',
    },

    validationSchema: Yup.object({
      invitation_has: Yup.string().max(128, 'Must be less than 128 characters'),
      fin: Yup.string().max(128, 'Must be less than 128 characters'),
      name: Yup.string().required().max(128, 'Must be less thatn 128 characters'),
      email: Yup.string().email('Invalid email address').required(),
      phone: Yup.string()
        .matches(
          /(^\+?251\d{9}$)|(^0(9|7)\d{8}$|^9\d{8}$)/, // Ethiopian phone number
          'Phone number is not valid'
        )
        .required('Phone number is required'),
      gender: Yup.string().required('Required'),
      date_of_birth: Yup.date()
        .required('Date of birth is required')
        .test('date_of_birth', 'Invalid date of birth', (value) => {
          return new Date(value).getTime() < new Date().getTime() - 315360000000; // must be at least 10 years old
        }),
      region: Yup.string().required('region is required'),
      country: Yup.string().required('Country is required'),
      address: Yup.string().required('Specify your address'),
      password: Yup.string().required('Password is Required'),
      confirmPassword: Yup.string().required('Confirm your password'),
      account_name: Yup.string()
        .required('account name is required')
        .min(12, 'Must be 12 character')
        .max(12, 'Must be 12 character'),
      photo_base64: Yup.string(),
      id_front_base64: Yup.string(),
      id_back_base64: Yup.string(),
    }),

    onSubmit: (values) => {
      setLoading(true);

      // Clear existing values
      setRegistrationID('');
      setSuccessMessage('');
      setErrorMessage('');

      authAxios
        .post('/bill/create', values)
        .then((res) => {
          setRegistrationID(res.data.id);

          // clear input fields
          formik.resetForm();
        })
        .catch((error) => {
          setErrorMessage(
            error.response?.data?.error || error.response?.data?.message || error.message
          );
        })
        .finally(() => setLoading(false));
    },
  });

  return (
    <div className="page-container">
      <h1 className="text-2xl font-semibold p-2 mb-5">Register Users</h1>

      {errorMessage && <InlineNotification type="error" info={errorMessage} />}

      {registrationID && (
        <InlineNotification
          type="success"
          info={`${successMessage ? successMessage : `Bill Payment ID: ${registrationID}`}`}
        />
      )}

      {successMessage && (
        <InlineNotification
          type="success"
          customType="Uploaded"
          info={`${successMessage ? successMessage : `Bill Payment ID: ${registrationID}`}`}
        />
      )}

      <div className="border border-b-0 rounded-t-xl p-2 px-5 max-w-[var(--form-width)] mx-auto bg-gray-50 mt-6">
        <h3 className="py-2 text-center text-gray-900 text-lg font-semibold">
          Create Level One/Two User
        </h3>
      </div>

      <form
        className="max-w-[var(--form-width)] border p-8 pt-6 rounded-b-xl mx-auto mb-20"
        onSubmit={formik.handleSubmit}
      >
        <div className="grid gap-6 mb-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="invitation_hash"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Invitation Code
            </label>
            <input
              type="text"
              id="invitation_hash"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="invitation_hash"
              autoComplete="off"
              disabled={isLoading}
              onChange={formik.handleChange}
              value={formik.values.invitation_hash}
            />
          </div>

          <div>
            <label htmlFor="fin" className="block mb-2 text-sm font-medium text-gray-900">
              Fayda Identification Number
            </label>
            <input
              type="text"
              id="fin"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="fin"
              disabled={isLoading}
              autoComplete="off"
              onChange={formik.handleChange}
              value={formik.values.fin}
            />
            <span className="text-sm text-red-600">{formik.touched.fin && formik.errors.fin}</span>
          </div>

          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="name"
              autoComplete="off"
              disabled={isLoading}
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            <span className="text-sm text-red-600">
              {formik.touched.name && formik.errors.name}
            </span>
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
              Email
            </label>
            <input
              type="text"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="email"
              autoComplete="off"
              disabled={isLoading}
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            <span className="text-sm text-red-600">
              {formik.touched.email && formik.errors.email}
            </span>
          </div>

          <div>
            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="phone"
              autoComplete="off"
              disabled={isLoading}
              onChange={formik.handleChange}
              value={formik.values.phone}
            />
            <span className="text-sm text-red-600">
              {formik.touched.phone && formik.errors.phone}
            </span>
          </div>

          <div>
            <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-900">
              Gender
            </label>
            <input
              type="text"
              id="gender"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="gender"
              disabled={isLoading}
              onChange={formik.handleChange}
              value={formik.values.gender}
            />
            <span className="text-sm text-red-600">
              {formik.touched.gender && formik.errors.gender}
            </span>
          </div>

          <div>
            <SelectElement
              title="Country"
              options={worldCountries}
              onSelect={(value) => formik.setFieldValue('country', value)}
            />
            <span className="text-sm text-red-600">
              {formik.touched.country && formik.errors.country}
            </span>
          </div>

          <div>
            <SelectElement
              title="Region"
              options={
                formik.values.country === 'Ethiopia' || formik.values.country == ''
                  ? EthiopianRegions
                  : []
              }
              onSelect={(value) => formik.setFieldValue('region', value)}
            />
            <span className="text-sm text-red-600">
              {formik.touched.region && formik.errors.region}
            </span>
          </div>

          <div>
            <input
              type="text"
              id="address"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="address"
              disabled={isLoading}
              onChange={formik.handleChange}
              value={formik.values.address}
            />
            <span className="text-sm text-red-600">
              {formik.touched.address && formik.errors.address}
            </span>
          </div>

          <div>
            <label htmlFor="account_name" className="block mb-2 text-sm font-medium text-gray-900">
              Username
            </label>
            <input
              type="text"
              id="account_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="account_name"
              disabled={isLoading}
              autoComplete="off"
              onChange={formik.handleChange}
              value={formik.values.account_name}
            />
            <span className="text-sm text-red-600">
              {formik.touched.account_name && formik.errors.account_name}
            </span>
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="password"
              autoComplete="off"
              disabled={isLoading}
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <span className="text-sm text-red-600">
              {formik.touched.password && formik.errors.password}
            </span>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="confirmPassword"
              disabled={isLoading}
              autoComplete="off"
              onChange={formik.handleChange}
              value={formik.values.confirmPassword}
            />
            <span className="text-sm text-red-600">
              {formik.touched.confirmPassword && formik.errors.confirmPassword}
            </span>
          </div>
        </div>

        <div className="grid gap-6 mt-10 mb-6 md:grid-cols-3">
          <div>
            <label htmlFor="photo_base64" className="block mb-2 text-sm font-medium text-gray-900">
              Photo
            </label>
            <input
              aria-describedby="photo_base64"
              name="photo_base64"
              id="photo_base64"
              accept=".jpeg"
              type="file"
              disabled={isLoading}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              onChange={(e) =>
                formik.setFieldValue('photo_base64', e.target.files && e.target.files[0])
              }
            />

            <span className="text-sm text-red-600">{formik.errors.photo_base64}</span>
          </div>

          <div>
            <label
              htmlFor="id_front_base64"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              ID photo front
            </label>
            <input
              aria-describedby="id_front_base64"
              name="id_front_base64"
              id="id_front_base64"
              accept=".jpeg"
              type="file"
              disabled={isLoading}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              onChange={(e) =>
                formik.setFieldValue('id_front_base64', e.target.files && e.target.files[0])
              }
            />

            <span className="text-sm text-red-600">{formik.errors.id_front_base64}</span>
          </div>

          <div>
            <label
              htmlFor="id_back_base64"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              ID photo back
            </label>
            <input
              aria-describedby="id_back_base64"
              name="id_back_base64"
              id="id_back_base64"
              accept=".jpeg"
              type="file"
              disabled={isLoading}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              onChange={(e) =>
                formik.setFieldValue('id_back_base64', e.target.files && e.target.files[0])
              }
            />

            <span className="text-sm text-red-600">{formik.errors.id_back_base64}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-[200px] px-5 py-2.5 text-center"
        >
          <span className="text-[15px]" style={{ letterSpacing: '0.3px' }}>
            {isLoading ? 'Please wait...' : 'Create Bill'}
          </span>
        </button>
      </form>
    </div>
  );
};

export default LevelOneAccount;
