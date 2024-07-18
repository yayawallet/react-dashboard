import { useEffect, useState, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InlineNotification from '../../components/InlineNotification';
import LevelTwoForm from './LevelTwoForm';
import { authAxios } from '../../api/axios';
import { formatTime } from '../../utils/formatTime';
import { RegistrationContext } from './Index';

interface Props {
  otp: string;
}

const VerifyOTP = ({ otp }: Props) => {
  // @ts-ignore
  const { store, setStore } = useContext(RegistrationContext);

  const [otpVerified, setOTPVerified] = useState(false);
  const [newOTP, setNewOTP] = useState(false);
  const [otpExpiresIn, setOTPExpiresIn] = useState(10);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);

  const handleOTPChange = (value: string) => {
    if (value.length === 6)
      if (value == otp) {
        setOTPVerified(true);
        setErrorMessage('');
      } else {
        setErrorMessage('Invalid OTP');
        setNewOTP(false);
      }
  };

  const getNewOTP = () => {
    setLoading(true);
    setNewOTP(false);
    setErrorMessage('');

    authAxios
      .post('/invitation/otp', {
        phone: store.phone,
        country: store.country,
        invite_hash: store.invite_hash,
      })
      .then(() => {
        setNewOTP(true);
      })
      .catch((error) =>
        setErrorMessage(
          error.response?.data?.error || error.response?.data?.message || error.message
        )
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (newOTP) setOTPExpiresIn(10);
  }, [newOTP]);

  useEffect(() => {
    if (otpExpiresIn > 0) {
      const timerId = setInterval(() => {
        setOTPExpiresIn((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId);
    } else {
      setNewOTP(false);
      setErrorMessage('OTP Expired');
      formik.resetForm();
    }
  }, [otpExpiresIn]);

  const formik = useFormik({
    initialValues: {
      otp: '',
    },

    validationSchema: Yup.object().shape({
      otp: Yup.number()
        .min(6, 'Must be 6 digit')
        .max(6, 'Must be 6 digit')
        .required('Enter the OTP sent'),
    }),

    onSubmit: () => {},
  });

  if (otpVerified) return <LevelTwoForm />;

  return (
    <div>
      {errorMessage && <InlineNotification type="error" info={errorMessage} />}

      {newOTP && (
        <InlineNotification
          type="success"
          customType="OTP is sent"
          info={`An OPT is sent to ${store.phone}`}
        />
      )}

      <div className="border border-b-0 rounded-t-xl p-2 px-5 max-w-[var(--form-width)] mx-auto bg-gray-50 mt-6">
        <h3 className="py-2 text-center text-gray-900 text-lg font-semibold">Verify OTP</h3>
      </div>

      <form
        className="max-w-[var(--form-width)] border p-8 pt-6 rounded-b-xl mx-auto mb-20"
        onSubmit={formik.handleSubmit}
        autoComplete="off"
      >
        <div className="grid gap-6 mb-4 md:grid-cols-5 items-center">
          <div className="md:col-span-2">
            <label htmlFor="otp" className="block mb-2 text-sm font-medium text-gray-900">
              Enter 6 digit OTP
            </label>
            <input
              type="number"
              autoFocus
              id="otp"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter OTP sent to your phone"
              autoComplete="new-otp"
              disabled={isLoading || otpExpiresIn == 0}
              onChange={(e) => {
                formik.handleChange(e);
                handleOTPChange(e.currentTarget.value);
              }}
              value={formik.values.otp}
            />
            <span className="pl-2 text-sm text-red-600">
              {formik.touched.otp && formik.errors.otp}
            </span>
          </div>

          <button
            type="button"
            disabled={isLoading || otpExpiresIn > 0}
            onClick={getNewOTP}
            className="text-gray-700 mt-1.5 border border-gray-300 font-medium rounded-lg px-5 py-2.5 text-center disabled:cursor-auto"
          >
            <span className="text-[15px]" style={{ letterSpacing: '0.3px' }}>
              {isLoading ? (
                '...'
              ) : otpExpiresIn === 0 ? (
                'Get OTP'
              ) : (
                <span className="text-black">{formatTime(otpExpiresIn)} sec</span>
              )}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerifyOTP;
