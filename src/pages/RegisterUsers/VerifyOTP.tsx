import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InlineNotification from '../../components/InlineNotification';
import { authAxios } from '../../api/axios';
import { formatTime } from '../../utils/formatTime';
import { RegistrationContext } from './Index';
import AccountType from './AccountType';
import LoadingSpinnerButton from '../../components/ui/LoadingSpinnerButton';

const VerifyOTP = () => {
  // @ts-ignore
  const { store, setStore } = useContext(RegistrationContext);
  const navigate = useNavigate();

  const [isOTPVerified, setOTPVerified] = useState(false);
  const [otpExpiresIn, setOTPExpiresIn] = useState(
    store?.registrationMethod == 'invitation' ? 120 : 300
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (otpExpiresIn > 0) {
      const timerId = setInterval(() => {
        setOTPExpiresIn((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId);
    } else if (otpExpiresIn === 0) {
      console.log('OTP Expires in 0 seconds');
      navigate('/register-user', { replace: true });
    }
  }, [otpExpiresIn]);

  const formik = useFormik({
    initialValues: {
      otp: '',
    },

    validationSchema: Yup.object().shape({
      otp: Yup.string()
        .matches(/^[0-9]{6}$/, 'Must be 6 digit number')
        .required('Enter the OTP sent to your phone'),
    }),

    onSubmit: (values) => {
      setErrorMessage('');
      setLoading(true);

      if (store.registrationMethod === 'invitation') {
        setTimeout(() => {
          if (store.otp?.toString() === values.otp?.toString()) {
            setOTPVerified(true);
            setOTPExpiresIn(-1);
          } else {
            setErrorMessage('Invalid OTP');
          }

          setLoading(false);
        }, 1000);
      } else if (store.registrationMethod === 'national-id') {
        authAxios
          .get(`/kyc/fayda/get-kyc-details/${store.fin}/${store.transaction_id}/${values.otp}`)
          .then((res) => {
            setOTPExpiresIn(-1);
            setOTPVerified(true);
            setStore({
              ...store,
              name: res.data.name_eng,
              date_of_birth: res.data.dob,
              gender: res.data.gender,
              phone: res.data.phone,
              email: res.data.email,
              address: res.data.address_eng?.split(',').slice(0, 2).join(','),
              fin: res.data.fin,
              photo: res.data.photo,
            });
          })
          .catch(() => setErrorMessage('Invalid OTP'))
          .finally(() => setLoading(false));
      } else {
        setErrorMessage('Something went wrong');
      }
    },
  });

  if (isOTPVerified) return <AccountType />;

  return (
    <div>
      {errorMessage && <InlineNotification type="error" info={errorMessage} />}

      <div className="border border-b-0 rounded-t-xl p-2 px-5 max-w-[var(--form-width)] mx-auto bg-gray-50 mt-6">
        <h3 className="py-2 text-center text-gray-900 text-lg font-semibold">Verify OTP</h3>
      </div>

      <form
        className="max-w-[var(--form-width)] border p-8 pt-6 rounded-b-xl mx-auto mb-20"
        onSubmit={formik.handleSubmit}
        autoComplete="off"
      >
        <div className="grid gap-6 mb-4 md:grid-cols-5 items-center">
          <div className="md:col-span-2 relative">
            <label htmlFor="otp" className="block mb-2 text-sm font-medium text-gray-900">
              Enter 6 digit OTP
            </label>
            <input
              type="number"
              autoFocus
              id="otp"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter OTP sent to your phone"
              autoComplete="off"
              disabled={isLoading}
              onChange={formik.handleChange}
              value={formik.values.otp}
            />
            <span className="absolute top-10 right-4 text-sm text-gray-700">
              {formatTime(otpExpiresIn)}
            </span>
            <span className="pl-2 text-sm text-red-600">
              {formik.touched.otp && formik.errors.otp}
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="text-white self-center bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-[200px] px-5 py-2.5 text-center"
          >
            <span className="text-[15px]" style={{ letterSpacing: '0.3px' }}>
              {isLoading ? <LoadingSpinnerButton /> : 'Verify OTP'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerifyOTP;
