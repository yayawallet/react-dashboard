import { useContext, useEffect, useState, useCallback } from 'react';
import { authAxios } from '../../api/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InlineNotification from '../../components/InlineNotification';
import SelectElement from '../../components/SelectElement';
import { resizeImage } from '../../utils/resizeImage';
import { useGetData } from '../../hooks/useSWR';
import Stepper from './Stepper';
import { RegistrationContext } from './Index';
import approvedIcon from '../../assets/approve-checked.gif';
import { Link } from 'react-router-dom';
import { suggestedUsername } from '../../utils/suggestedUsername';
import { debounce } from 'lodash';

const CreateAccount = () => {
  // @ts-ignore
  const { store, setStore } = useContext(RegistrationContext);

  const [registeredAccountName, setRegisteredAccountName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [accountnameLookup, setAccountnameLookup] = useState('');
  const [emailLookup, setEmailLookup] = useState('');
  const [isAccountNameAvailable, setIsAccountNameAvailable] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(store.accountType === 'business' ? 5 : 4);
  const [stepTitle, setStepTitle] = useState('');
  const [isChecking, setChecking] = useState(false);
  const [userPhoto, setUserPhoto] = useState('');

  const { data: regionsList } = useGetData('/lookup/region');

  useEffect(() => {
    if (currentStep === 1) setStepTitle('Personal Information');
    if (currentStep === 2) setStepTitle('Address Information');
    if (currentStep === 3) setStepTitle('Account Information');
    if (currentStep === 4) setStepTitle('User Documents');
    if (currentStep === 5) setStepTitle('Business Documents');
  }, [currentStep]);

  useEffect(() => {
    if (store.photo?.length > 0) {
      formik.setFieldValue('photo_base64', `data:image/jpeg;base64,${store.photo}`);
    }
  }, [store.photo]);

  useEffect(() => {
    if (currentStep !== 2 || formik.values.account_name) return;

    (async () => {
      const res = await suggestedUsername(formik.values.name);
      formik.setFieldValue('account_name', res);
    })();
  }, [currentStep]);

  const handleAccountNameLookup = (account: string) => {
    setIsAccountNameAvailable(false);

    if (account.length !== 12) return;

    setAccountnameLookup('');
    setChecking(true);

    authAxios
      .post('/user/search', { query: account })
      .then((res) => {
        if (res.data.length === 0) setIsAccountNameAvailable(true);
        else setAccountnameLookup('Account name already taken');
      })
      .finally(() => setChecking(false));
  };

  const debouncedHandleEmailLookup = useCallback(
    debounce((email) => {
      setEmailLookup('');
      setChecking(true);

      authAxios
        .post('/user/search', { query: email })
        .then((res) => {
          if (res.data.length > 0) setEmailLookup('User already exists');
        })
        .finally(() => setChecking(false));
    }, 500),
    []
  );

  const handleEmailLookup = (email: string) => {
    if (email.length < 4) return;

    debouncedHandleEmailLookup(email);
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
      invitation_hash: store.invite_hash || '',
      fin: store.fin || '',
      name: store.name || '',
      gender: store.gender || '',
      email: store.email || '',
      phone: store.phone || '',
      date_of_birth: store.date_of_birth
        ? new Date((store.date_of_birth + 10800) * 1000).toISOString().slice(0, 10) // 10800 = 3 hours = 60 * 60 * 3
        : '',
      region: store.region || '',
      country: 'Ethiopia',
      address: store.address || '',
      password: '',
      confirmPassword: '',
      account_name: '',
      photo_base64: store.photo || '',
      id_front_base64: '',
      id_back_base64: '',
      // only for business account
      tin_number: store.tin_number || '',
      license_number: store.license_number || '',
      mcc: store.mcc || '',
      tin_doc_base64: '',
      license_doc_base64: '',
    },

    enableReinitialize: true,
    validateOnMount: true,

    validationSchema: Yup.object().shape({
      name: Yup.string()
        .trim()
        .required('Required')
        .matches(/^[a-z\s]*$/i, 'Invalid Name')
        .min(4, 'Name too short')
        .max(128, 'Must be less thatn 128 characters'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      gender: Yup.string().required('Required'),
      date_of_birth: Yup.date()
        .required('Required')
        .min(new Date('1900-01-01'), 'Must be after 1900')
        .max(new Date('2014-12-31'), 'Must be before 2014'),
      country: Yup.string().required('Required'),
      region: Yup.string().required('Required'),
      address: Yup.string().required('Specify your address'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .max(128, 'Password too long')
        .required('Password is Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
        .required('Confirm your password'),
      account_name: Yup.string()
        .matches(/^[a-z]/, 'Must start with letter')
        .matches(/^[a-z0-5]*$/, 'Can only contain characters a-z and 1-5')
        .matches(/^[a-z0-5]{12}$/, 'Must be 12 characters')
        .required('Account name is required'),
      photo_base64: Yup.string().required('Required'),
      id_front_base64: Yup.string().required('Required'),
      id_back_base64: Yup.string().required('Required'),
      tin_doc_base64: Yup.string().test('is-required', 'Required', function (value) {
        {
          const { createError } = this;
          if (store.accountType === 'business' && !value) {
            return createError({ message: 'Required' });
          }
          return true;
        }
      }),
      license_doc_base64: Yup.string().test('is-required', 'Required', function (value) {
        {
          const { createError } = this;
          if (store.accountType === 'business' && !value) {
            return createError({ message: 'Required' });
          }
          return true;
        }
      }),
    }),

    onSubmit: (values) => {
      if (emailLookup || accountnameLookup) return;

      setLoading(true);

      // Clear existing values
      setRegisteredAccountName('');
      setErrorMessage('');

      authAxios
        .post(
          `${store.accountType === 'business' ? '/user/register-business' : '/user/register'}`,
          {
            ...values,
            date_of_birth: new Date(values.date_of_birth).getTime(),
          }
        )
        .then((res) => {
          setRegisteredAccountName(res.data.account);
          setUserPhoto(values.photo_base64);

          formik.resetForm(); // clear input fields
          setStore({}); // clear store values
        })
        .catch((error) => {
          setErrorMessage(
            error.response?.data?.error || error.response?.data?.message || 'Registration Failed!!'
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

  const handleClickNext = () => {
    if (currentStep === totalSteps) {
      formik.handleSubmit();
      return;
    }

    switch (currentStep) {
      case 1:
        if (
          formik.errors.name ||
          formik.errors.date_of_birth ||
          formik.errors.gender ||
          formik.errors.email
        ) {
          formik.setTouched({ name: true, date_of_birth: true, gender: true, email: true });
          return;
        }

        break;

      case 2:
        if (formik.errors.country || formik.errors.region || formik.errors.address) {
          formik.setTouched({ country: true, region: true, address: true });
          return;
        }

        break;

      case 3:
        if (formik.errors.account_name || formik.errors.password || formik.errors.confirmPassword) {
          formik.setTouched({ account_name: true, password: true, confirmPassword: true });
          return;
        }

        break;

      case 4:
        if (
          formik.errors.photo_base64 ||
          formik.errors.id_front_base64 ||
          formik.errors.id_back_base64
        ) {
          formik.setTouched({ photo_base64: true, id_front_base64: true, id_back_base64: true });
          return;
        }

        break;
    }

    if (isChecking || emailLookup || accountnameLookup) return;

    setCurrentStep((prev) => prev + 1);
  };

  const handleClickBack = () => {
    if (currentStep === 1) return;
    setCurrentStep((prev) => prev - 1);
  };

  if (registeredAccountName) {
    return (
      <div className="flex flex-col gap-6 justify-center items-center mb-20">
        <div className="mb-6 self-stretch">
          <InlineNotification
            type="success"
            customType="Account created successfully"
            info={`account name: ${registeredAccountName}`}
          />
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 mb-6">
          <div className="flex flex-col items-center">
            <img src={userPhoto} className="h-28 w-28 object-cover rounded-full" alt="" />
            <span className="bg-violet-500 text-white px-2 pb-0.5 text-sm rounded">
              {registeredAccountName}
            </span>
          </div>

          <img src={approvedIcon} className="h-24" alt="" />
        </div>

        <Link to="/register-user">
          <button
            type="button"
            className={`text-white mr-28 bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 rounded-lg px-8 py-2.5 text-center ${currentStep === 1 ? 'hidden' : ''}`}
            onClick={handleClickBack}
          >
            Register another user
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="page-containerr">
      {errorMessage && <InlineNotification type="error" info={errorMessage} />}

      <div className="border border-b-0 rounded-t-xl p-2 px-5 max-w-[var(--form-width)] mx-auto bg-gray-50 mt-6">
        <h3 className="py-2 text-center text-gray-900 text-lg font-semibold">
          Create Level-two Account
        </h3>
      </div>

      <form
        className="max-w-[var(--form-width)] border p-8 pt-6 rounded-b-xl mx-auto mb-20"
        onSubmit={formik.handleSubmit}
        autoComplete="off"
      >
        <div className="relative mt-2 mb-2 max-w-[600px] mx-auto">
          <Stepper totalSteps={totalSteps} currentStep={currentStep} />
        </div>

        <div className="md:grid" style={{ gridTemplateColumns: `repeat(${totalSteps}, 1fr)` }}>
          <h2
            className={`mb-10 text-center col-start-${currentStep} md:font-semibold px-3 pt-0.5 pb-1 bg-violet-500 rounded-lg text-white`}
            style={{ gridColumn: `${currentStep} / ${currentStep + 1}` }}
          >
            {stepTitle}
          </h2>
        </div>

        <div className={`${currentStep === 1 ? '' : 'hidden'} max-w-[500px] mx-auto mb-6`}>
          <div>
            <div>
              <label htmlFor="name" className="block mb-1 pl-1 text-sm font-medium text-gray-900">
                Full Name
              </label>
              <input
                type="text"
                readOnly={
                  store.registrationMethod === 'national-id' || store.accountType === 'business'
                }
                id="name"
                autoFocus
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="name"
                autoComplete="off"
                disabled={isLoading}
                onChange={formik.handleChange}
                value={formik.values.name}
                onKeyDown={(e) => (e.key === 'Enter' ? handleClickNext() : undefined)}
              />
              <span className="block mb-5 pl-2 text-sm text-red-600">
                {formik.touched.name && formik.errors.name}
              </span>
            </div>

            <div className="grid gap-x-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="date_of_birth"
                  className="block mb-1 pl-1 text-sm font-medium text-gray-900"
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  readOnly={store.registrationMethod === 'national-id'}
                  name="date_of_birth"
                  id="date_of_birth"
                  min="1900-01-01"
                  max="2014-12-31"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  disabled={isLoading}
                  onChange={formik.handleChange}
                  value={formik.values.date_of_birth}
                />
                <span className="block mb-5 pl-2 text-sm text-red-600">
                  {formik.touched.date_of_birth && formik.errors.date_of_birth}
                </span>
              </div>

              <div>
                <span className="inline-block mb-2 font-medium text-sm text-gray-900">Gender</span>
                <div className="flex border border-gray-300 rounded-lg p-2.5">
                  <div className="flex items-center me-4">
                    <input
                      id="male"
                      type="radio"
                      disabled={store.registrationMethod === 'national-id'}
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
                      disabled={store.registrationMethod === 'national-id'}
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

                <span className="block mb-5 pl-2 text-sm text-red-600">
                  {formik.touched.gender && formik.errors.gender}
                </span>
              </div>

              <div className="-mb-5">
                <label
                  htmlFor="email"
                  className="block mb-1 pl-1 text-sm font-medium text-gray-900"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="email"
                  autoComplete="new-email"
                  disabled={isLoading}
                  onChange={(e) => {
                    formik.handleChange(e);
                    handleEmailLookup(e.target.value);
                  }}
                  value={formik.values.email}
                  onKeyDown={(e) => (e.key === 'Enter' ? handleClickNext() : undefined)}
                />
                {!formik.errors.email && isChecking && (
                  <span className="inline-block mt-1 pl-2 font-semibold text-sm text-gray-800">
                    <span
                      className="inline-block border-gray-500 h-3 w-3 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status"
                    ></span>{' '}
                    Checking
                  </span>
                )}
                <span className="block mb-5 pl-2 text-sm text-red-600">
                  {formik.touched.email && formik.errors.email}
                  {!formik.errors.email && emailLookup}
                </span>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block mb-1 pl-1 text-sm font-medium text-gray-900"
                >
                  Phone
                </label>
                <input
                  type="text"
                  readOnly={true}
                  id="phone"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="phone"
                  autoComplete="new-phone"
                  disabled={isLoading}
                  value={formik.values.phone}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={`${currentStep === 2 ? '' : 'hidden'} max-w-[500px] mx-auto mb-6`}>
          <div>
            <div>
              <label
                htmlFor="account_name"
                className="block mb-1 pl-1 text-sm font-medium text-gray-900"
              >
                Address
              </label>

              <input
                type="text"
                readOnly={
                  store.registrationMethod === 'national-id' || store.accountType === 'business'
                }
                id="address"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="address"
                disabled={isLoading}
                onChange={formik.handleChange}
                value={formik.values.address}
                autoComplete="address"
                onKeyDown={(e) => (e.key === 'Enter' ? handleClickNext() : undefined)}
              />
              <span className="block mb-5 pl-2 text-sm text-red-600">
                {formik.touched.address && formik.errors.address}
              </span>
            </div>

            <div className="grid gap-x-6 md:grid-cols-2 mt-6">
              <div>
                <span className="block mb-1 pl-1 text-sm font-medium text-gray-900">Country</span>
                <SelectElement
                  title="Country"
                  options={[{ code: 'Ethiopia', value: 'Ethiopia' }]}
                  disabled={true}
                  defaultValue={formik.values.country}
                  onSelect={(value) => formik.setFieldValue('country', value)}
                />
                <span className="block mb-5 pl-2 text-sm text-red-600">
                  {formik.touched.country && formik.errors.country}
                </span>
              </div>

              <div>
                <span className="block mb-1 pl-1 text-sm font-medium text-gray-900">Region</span>
                <SelectElement
                  title="Region"
                  options={
                    regionsList
                      ? Object.entries(regionsList).map(([code, value]) => ({ code, value }))
                      : []
                  }
                  defaultValue={formik.values.region}
                  onSelect={(value) => formik.setFieldValue('region', value)}
                  disabled={isLoading}
                />
                <span className="block mb-5 pl-2 text-sm text-red-600">
                  {formik.touched.region && formik.errors.region}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={`${currentStep === 3 ? '' : 'hidden'} max-w-[500px] mx-auto mb-6`}>
          <div>
            <div>
              <label
                htmlFor="account_name"
                className="block mb-1 pl-1 text-sm font-medium text-gray-900"
              >
                Account Name
              </label>
              <input
                type="text"
                id="account_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="account_name"
                maxLength={12}
                disabled={isLoading}
                autoComplete="new-username"
                onChange={(e) => {
                  formik.handleChange(e);
                  handleAccountNameLookup(e.target.value);
                }}
                value={formik.values.account_name}
                onKeyDown={(e) => (e.key === 'Enter' ? handleClickNext() : undefined)}
              />
              {!formik.errors.account_name && isChecking && (
                <span className="inline-block mt-1 pl-2 font-semibold text-sm text-gray-800">
                  <span
                    className="inline-block border-gray-500 h-3 w-3 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                  ></span>{' '}
                  Checking
                </span>
              )}
              <span className="block mb-5 pl-2 text-sm text-red-600 font-semibold">
                {formik.errors.account_name}
                {!formik.errors.account_name && accountnameLookup}
                {!formik.errors.account_name && isAccountNameAvailable && (
                  <span className="text-green-600">Available</span>
                )}
              </span>
            </div>

            <div className="grid gap-x-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="password"
                  className="block mb-1 pl-1 text-sm font-medium text-gray-900"
                >
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
                  onKeyDown={(e) => (e.key === 'Enter' ? handleClickNext() : undefined)}
                />

                <span className="block mb-5 pl-2 text-sm text-red-600">
                  {formik.touched.password && formik.errors.password}
                </span>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-1 pl-1 text-sm font-medium text-gray-900"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="confirmPassword"
                  disabled={isLoading}
                  autoComplete="new-password"
                  onChange={formik.handleChange}
                  value={formik.values.confirmPassword}
                  onKeyDown={(e) => (e.key === 'Enter' ? handleClickNext() : undefined)}
                />
                <span className="block mb-5 pl-2 text-sm text-red-600">
                  {formik.touched.confirmPassword && formik.errors.confirmPassword}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={`${currentStep === 4 ? '' : 'hidden'} max-w-[500px] mx-auto mb-6`}>
          <div className="grid gap-x-8 gap-y-6 md:grid-cols-2 items-center">
            <div>
              <label
                htmlFor="photo_base64"
                className="block mb-1 pl-1 text-sm font-medium text-gray-900"
              >
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

              <span className="block mb-2 pl-2 text-sm text-red-600">
                {formik.touched.photo_base64 && formik.errors.photo_base64}
              </span>
            </div>

            <div className="">
              {formik.values.photo_base64 && (
                <img
                  src={formik.values.photo_base64}
                  className="inline-block h-28 w-28 object-cover rounded-full"
                  alt="user photo"
                />
              )}
            </div>

            <div>
              <label
                htmlFor="id_front_base64"
                className="block mb-1 pl-1 text-sm font-medium text-gray-900"
              >
                ID photo front
              </label>
              <div>
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

                <span className="block mb-2 pl-2 text-sm text-red-600">
                  {formik.touched.id_front_base64 && formik.errors.id_front_base64}
                </span>
              </div>
            </div>

            <div className="">
              {formik.values.id_front_base64 && (
                <img
                  src={formik.values.id_front_base64}
                  className="inline-block h-28 max-w-96 object-cover"
                  alt=""
                />
              )}
            </div>

            <div>
              <label
                htmlFor="id_back_base64"
                className="block mb-1 pl-1 text-sm font-medium text-gray-900"
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

              <span className="block mb-2 pl-2 text-sm text-red-600">
                {formik.touched.id_back_base64 && formik.errors.id_back_base64}
              </span>
            </div>

            <div className="">
              {formik.values.id_back_base64 && (
                <img
                  src={formik.values.id_back_base64}
                  className="inline-block mb-6 h-28 max-w-96 object-cover"
                  alt=""
                />
              )}
            </div>
          </div>
        </div>

        <div className={`${currentStep === 5 ? '' : 'hidden'} max-w-[500px] mx-auto mb-6`}>
          <div className="grid gap-x-8 gap-y-6 md:grid-cols-2 items-center">
            <div>
              <label
                htmlFor="tin_doc_base64"
                className="block mb-1 pl-1 text-sm font-medium text-gray-900"
              >
                TIN Document
              </label>
              <div>
                <input
                  aria-describedby="tin_doc_base64"
                  name="tin_doc_base64"
                  id="tin_doc_base64"
                  accept=".jpg, .jpeg"
                  type="file"
                  disabled={isLoading}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                  onChange={(e) => handleImageOnChange(e, 'tin_doc_base64')}
                />

                <span className="block mb-2 pl-2 text-sm text-red-600">
                  {formik.touched.tin_doc_base64 && formik.errors.tin_doc_base64}
                </span>
              </div>
            </div>

            <div className="">
              {formik.values.tin_doc_base64 && (
                <img
                  src={formik.values.tin_doc_base64}
                  className="inline-block h-28 max-w-96 object-cover"
                  alt=""
                />
              )}
            </div>

            <div>
              <label
                htmlFor="license_doc_base64"
                className="block mb-1 pl-1 text-sm font-medium text-gray-900"
              >
                License Document
              </label>
              <input
                aria-describedby="license_doc_base64"
                name="license_doc_base64"
                id="license_doc_base64"
                accept=".jpg, .jpeg"
                type="file"
                disabled={isLoading}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                onChange={(e) => handleImageOnChange(e, 'license_doc_base64')}
              />

              <span className="block mb-2 pl-2 text-sm text-red-600">
                {formik.touched.license_doc_base64 && formik.errors.license_doc_base64}
              </span>
            </div>

            <div className="">
              {formik.values.license_doc_base64 && (
                <img
                  src={formik.values.license_doc_base64}
                  className="inline-block mb-6 h-28 max-w-96 object-cover"
                  alt=""
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 text-[16px]" style={{ letterSpacing: '5px' }}>
          <button
            type="button"
            disabled={isLoading}
            className={`text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 rounded-lg px-8 py-2.5 text-center ${currentStep === 1 ? 'hidden' : ''}`}
            onClick={handleClickBack}
          >
            BACK
          </button>

          <button
            type="button"
            disabled={isLoading}
            className="text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 rounded-lg px-8 py-2.5 text-center"
            onClick={handleClickNext}
          >
            {currentStep === totalSteps ? (isLoading ? 'SUBMITTING...' : 'SUBMIT') : 'NEXT'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccount;
