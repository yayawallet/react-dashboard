import { useState } from 'react';
import { authAxios } from '../../api/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InlineNotification from '../../components/InlineNotification';
import SelectElement from '../../components/SelectElement';
import { resizeImage } from '../../utils/resizeImage';
import { useGetData } from '../../hooks/useSWR';

const CreateLevelTwoAccount = () => {
  const [registrationID, setRegistrationID] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [phoneNumberLookup, setPhoneNumberLookup] = useState('');
  const [accountNameLookup, setAccountNameLookup] = useState('');
  const [emailLookup, setEmailLookup] = useState('');
  const [isAccountNameAvailable, setIsAccountNameAvailable] = useState(false);

  const { data: regionsList } = useGetData('/lookup/region');

  const handlePhoneNumberLookup = (number: string) => {
    if (number.length < 9) return;

    if (number.startsWith('0') && number.length < 10) return;
    if ((number.startsWith('7') || number.startsWith('9')) && number.length < 9) return;
    if (number.startsWith('+2510') && number.length < 14) return;
    if (number.startsWith('+251') && number.length < 13) return;

    setPhoneNumberLookup('');

    authAxios.post('/user/search', { query: number }).then((res) => {
      if (res.data.length > 0) setPhoneNumberLookup('User already exists');
    });
  };

  const handleAccountNameLookup = (account: string) => {
    setIsAccountNameAvailable(false);

    if (account.length !== 12) return;

    setAccountNameLookup('');

    authAxios.post('/user/search', { query: account }).then((res) => {
      if (res.data.length === 0) setIsAccountNameAvailable(true);
      else setAccountNameLookup('Account name already taken');
    });
  };

  const handleEmailLookup = (email: string) => {
    if (email.length < 6) return;

    setEmailLookup('');

    authAxios.post('/user/search', { query: email }).then((res) => {
      if (res.data.length > 0) setEmailLookup('User already exists');
    });
  };

  const handleImageOnChange = (e: React.ChangeEvent<HTMLInputElement>, field_name: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = (e) => {
      const target = e.target as FileReader;
      const base64String = target.result;
      if (base64String) {
        if (field_name === 'photo_base64') {
          // resizeImage(DataURL, maxWidth, maxHeight, callback)
          resizeImage(base64String, 800, 800, (resizedBase64) => {
            formik.setFieldValue(field_name, resizedBase64);
          });
        } else {
          formik.setFieldValue(field_name, base64String);
        }
      }
    };
  };

  const formik = useFormik({
    initialValues: {
      invitation_hash: '',
      fin: '',
      name: '',
      gender: '',
      email: '',
      phone: '',
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

    validate: (values) => {
      interface Errors {
        invitation_hash?: string;
        fin?: string;
        country?: string;
        region?: string;
        account_name?: string;
      }

      const errors: Errors = {};

      if (!values.invitation_hash && !values.fin) {
        errors.fin = 'FIN or invitation code is required';
        errors.invitation_hash = 'Invitation code or FIN is required';
      }

      if (values.fin.length > 0 && values.fin.length !== 12 && values.fin.length !== 16) {
        errors.fin = 'Must be 12 or 16 characters';
      }

      if (values.country.toUpperCase() === 'ETHIOPIA' && !values.region)
        errors.region = 'select your region';

      return errors;
    },

    validationSchema: Yup.object().shape({
      invitation_has: Yup.string().max(128, 'must be less than 128 characters'),
      fin: Yup.string(),
      name: Yup.string()
        .required('name is required')
        .min(4, 'name too short')
        .max(128, 'must be less thatn 128 characters'),
      email: Yup.string().email('Invalid email address').required('email is required'),
      gender: Yup.string().required('required'),
      phone: Yup.string()
        .matches(
          /(^\+?251\d{9}$)|(^0(9|7)\d{8}$|^9\d{8}$)/, // Ethiopian phone number
          'phone number is not valid'
        )
        .required('phone number is required'),
      date_of_birth: Yup.date()
        .required('date of birth is required')
        .min(new Date('1900-01-01'), 'must be after 1900')
        .max(new Date('2014-12-31'), 'must be before 2014'),
      country: Yup.string().required('country is required'),
      region: Yup.string().required('select your region'),
      address: Yup.string().required('specify your address'),
      password: Yup.string()
        .min(6, 'password must be at least 6 characters')
        .max(128, 'Password too long')
        .required('password is Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
        .required('confirm your password'),
      account_name: Yup.string()
        .required('account name is required')
        .min(12, 'must be 12 character')
        .max(12, 'must be 12 character'),
      photo_base64: Yup.string().required('required'),
      id_front_base64: Yup.string().required('required'),
      id_back_base64: Yup.string().required('required'),
    }),

    onSubmit: (values) => {
      if (phoneNumberLookup || emailLookup || accountNameLookup) return;

      setLoading(true);

      // Clear existing values
      setRegistrationID('');
      setErrorMessage('');

      authAxios
        .post('/user/register', {
          ...values,
          date_of_birth: new Date(values.date_of_birth).getTime(),
        })
        .then((res) => {
          setRegistrationID(res.data.account);

          // clear input fields
          formik.resetForm();
        })
        .catch((error) => {
          setErrorMessage(
            error.response?.data?.error || error.response?.data?.message || error.message
          );
        })
        .finally(() => {
          setLoading(false);
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        });
    },
  });

  return (
    <div className="page-container">
      <h1 className="text-2xl font-semibold p-2 mb-5">Register Users</h1>

      {errorMessage && <InlineNotification type="error" info={errorMessage} />}

      {registrationID && (
        <InlineNotification
          type="success"
          customType="Account created successfully"
          info={`account name: ${registrationID}`}
        />
      )}

      <div className="border border-b-0 rounded-t-xl p-2 px-5 max-w-[var(--form-width)] mx-auto bg-gray-50 mt-6">
        <h3 className="py-2 text-center text-gray-900 text-lg font-semibold">
          Create Level-two Account
        </h3>
      </div>

      <form
        className="max-w-[var(--form-width)] border p-8 pt-6 rounded-b-xl mx-auto mb-20"
        onSubmit={formik.handleSubmit}
      >
        <div className="grid gap-6 mb-6 md:grid-cols-3">
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

            <span className="pl-2 text-sm text-red-600">
              {formik.touched.invitation_hash && formik.errors.invitation_hash}
            </span>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="fin" className="block mb-2 text-sm font-medium text-gray-900">
              Fayda Identification Number
            </label>
            <input
              type="text"
              id="fin"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="FIN or FCN"
              disabled={isLoading}
              autoComplete="off"
              onChange={formik.handleChange}
              value={formik.values.fin}
            />
            <span className="pl-2 text-sm text-red-600">
              {formik.touched.fin && formik.errors.fin}
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
              autoComplete="new-phone"
              disabled={isLoading}
              onChange={(e) => {
                formik.handleChange(e);
                handlePhoneNumberLookup(e.target.value);
              }}
              value={formik.values.phone}
            />
            <span className="pl-2 text-sm text-red-600">
              {formik.touched.phone && formik.errors.phone}
              {!formik.errors.phone && phoneNumberLookup}
            </span>
          </div>

          <div className="md:col-span-2">
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
              onChange={(e) => {
                formik.handleChange(e);
                handleEmailLookup(e.target.value);
              }}
              value={formik.values.email}
            />
            <span className="pl-2 text-sm text-red-600">
              {formik.touched.email && formik.errors.email}
              {!formik.errors.email && emailLookup}
            </span>
          </div>
        </div>

        <div className="grid gap-6 mb-8 md:grid-cols-3">
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
            <span className="pl-2 text-sm text-red-600">
              {formik.touched.name && formik.errors.name}
            </span>
          </div>

          <div className="">
            <span className="inline-block mb-2 font-medium text-sm text-gray-900">Gender</span>
            <div className="flex border border-gray-300 rounded-lg p-2.5">
              <div className="flex items-center me-4">
                <input
                  id="male"
                  type="radio"
                  value="male"
                  name="gender"
                  className="w-4 h-4 cursor-pointer"
                  onChange={formik.handleChange}
                  checked={formik.values.gender === 'male'}
                />
                <label
                  htmlFor="male"
                  className="ms-2 text-sm font-medium text-gray-900 cursor-pointer"
                >
                  Male
                </label>
              </div>
              <div className="flex items-center me-4">
                <input
                  id="female"
                  type="radio"
                  value="female"
                  name="gender"
                  className="w-4 h-4 cursor-pointer"
                  onChange={formik.handleChange}
                  checked={formik.values.gender === 'female'}
                />
                <label
                  htmlFor="female"
                  className="ms-2 text-sm font-medium text-gray-900 cursor-pointer"
                >
                  Female
                </label>
              </div>
            </div>

            <span className="pl-2 text-sm text-red-600">
              {formik.touched.gender && formik.errors.gender}
            </span>
          </div>

          <div>
            <label htmlFor="date_of_birth" className="block mb-2 text-sm font-medium text-gray-900">
              Date of Birth
            </label>
            <input
              type="date"
              name="date_of_birth"
              id="date_of_birth"
              min="1900-01-01"
              max="2014-12-31"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              disabled={isLoading}
              value={formik.values.date_of_birth}
              onChange={formik.handleChange}
            />
            <span className="pl-2 text-sm text-red-600">
              {formik.touched.date_of_birth && formik.errors.date_of_birth}
            </span>
          </div>
        </div>

        <div className="grid gap-6 mb-4 md:grid-cols-3">
          <div>
            <SelectElement
              title="Country"
              options={[{ code: 'Ethiopia', value: 'Ethiopia' }]}
              onSelect={(value) => formik.setFieldValue('country', value)}
            />
            <span className="pl-2 text-sm text-red-600">
              {formik.touched.country && formik.errors.country}
            </span>
          </div>

          <div>
            <SelectElement
              title="Region"
              options={
                regionsList
                  ? Object.entries(regionsList).map(([code, value]) => ({ code, value }))
                  : []
              }
              onSelect={(value) => formik.setFieldValue('region', value)}
            />
            <span className="pl-2 text-sm text-red-600">
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
              autoComplete="address"
            />
            <span className="pl-2 text-sm text-red-600">
              {formik.touched.address && formik.errors.address}
            </span>
          </div>

          <div>
            <label htmlFor="account_name" className="block mb-2 text-sm font-medium text-gray-900">
              Account Name
            </label>
            <input
              type="text"
              id="account_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="account_name"
              disabled={isLoading}
              autoComplete="new-password"
              onChange={(e) => {
                formik.handleChange(e);
                handleAccountNameLookup(e.target.value);
              }}
              value={formik.values.account_name}
            />
            <span className="pl-2 text-sm text-red-600">
              {formik.touched.account_name && formik.errors.account_name}
              {!formik.errors.account_name && accountNameLookup}
              {isAccountNameAvailable && <span className="text-green-600">Available</span>}
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
              autoComplete="new-password"
              disabled={isLoading}
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <span className="pl-2 text-sm text-red-600">
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
            <span className="pl-2 text-sm text-red-600">
              {formik.touched.confirmPassword && formik.errors.confirmPassword}
            </span>
          </div>
        </div>

        <div className="grid gap-6 mt-10 mb-6 md:grid-cols-3">
          <div>
            <label htmlFor="photo_base64" className="block mb-2 text-sm font-medium text-gray-900">
              User Photo
            </label>
            <input
              aria-describedby="photo_base64"
              name="photo_base64"
              id="photo_base64"
              accept=".jpg, .jpeg"
              type="file"
              disabled={isLoading}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              onChange={(e) => handleImageOnChange(e, 'photo_base64')}
            />

            <span className="pl-2 text-sm text-red-600">
              {formik.touched.photo_base64 && formik.errors.photo_base64}
            </span>
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
              accept=".jpg, .jpeg"
              type="file"
              disabled={isLoading}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              onChange={(e) => handleImageOnChange(e, 'id_front_base64')}
            />

            <span className="pl-2 text-sm text-red-600">
              {formik.touched.id_front_base64 && formik.errors.id_front_base64}
            </span>
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
              accept=".jpg, .jpeg"
              type="file"
              disabled={isLoading}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              onChange={(e) => handleImageOnChange(e, 'id_back_base64')}
            />

            <span className="pl-2 text-sm text-red-600">
              {formik.touched.id_back_base64 && formik.errors.id_back_base64}
            </span>
          </div>
        </div>

        <button
          type="submit"
          // @ts-ignore
          disabled={isLoading || phoneNumberLookup || emailLookup || accountNameLookup}
          className="text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-[200px] px-5 py-2.5 text-center"
        >
          <span className="text-[15px]" style={{ letterSpacing: '0.3px' }}>
            {isLoading ? 'Please wait...' : 'Register User'}
          </span>
        </button>
      </form>
    </div>
  );
};

export default CreateLevelTwoAccount;
