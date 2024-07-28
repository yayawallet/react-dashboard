import { useContext, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { authAxios } from '../../api/axios';
import InlineNotification from '../../components/InlineNotification';
import VerifyOTP from './VerifyOTP';
import { RegistrationContext } from './Index';
import LoadingSpinnerButton from '../../components/ui/LoadingSpinnerButton';

const Invitation = () => {
  // @ts-ignore
  const { store, setStore } = useContext(RegistrationContext);

  const [OTPSent, setOTPSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);

  const handlePhoneNumberLookup = (number: string) => {
    setIsNewUser(null);

    if (number.length < 9) return;

    if (number.startsWith('0') && number.length < 10) return;
    if ((number.startsWith('7') || number.startsWith('9')) && number.length < 9) return;
    if (number.startsWith('+2510') && number.length < 14) return;
    if (number.startsWith('+251') && number.length < 13) return;

    setIsCheckingPhone(true);

    authAxios
      .post('/user/search', { query: number })
      .then((res) => {
        if (res.data.length > 0) setIsNewUser(false);
        else setIsNewUser(true);
      })
      .finally(() => setIsCheckingPhone(false));
  };

  const formik = useFormik({
    initialValues: {
      phone: '',
      amount: 0,
      country: 'Ethiopia',
    },

    validationSchema: Yup.object().shape({
      phone: Yup.string()
        .matches(
          /(^\+?251\d{9}$)|(^0(9|7)\d{8}$|^9\d{8}$)/, // Ethiopian phone number
          'phone number is not valid'
        )
        .required('phone number is required'),
      amount: Yup.number().min(0, 'cannot be less than 0'),
    }),

    onSubmit: (values) => {
      if (!isNewUser) return;

      setLoading(true);

      // Clear existing values
      setOTPSent(false);
      setErrorMessage('');
      setStore({});

      authAxios
        .post('/invitation/create', values)
        .then((res) => {
          authAxios
            .post('/invitation/otp', {
              phone: values.phone,
              country: values.country,
              invite_hash: res.data.invite_hash,
            })
            .then(() => {
              setOTPSent(true);
              setStore({
                phone: values.phone,
                country: values.country,
                invite_hash: res.data.invite_hash,
                otp: res.data.otp,
                registrationMethod: 'invitation',
              });
            })
            .catch((error) =>
              setErrorMessage(
                error.response?.data?.error || error.response?.data?.message || error.message
              )
            )
            .finally(() => setLoading(false));
        })
        .catch((error) => {
          setErrorMessage(
            error.response?.data?.error || error.response?.data?.message || error.message
          );
          setLoading(false);
        });
    },
  });

  if (OTPSent) return <VerifyOTP />;

  return (
    <div>
      {errorMessage && <InlineNotification type="error" info={errorMessage} />}

      <div className="border border-b-0 rounded-t-xl p-2 px-5 max-w-[var(--form-width)] mx-auto bg-gray-50 mt-6">
        <h3 className="py-2 text-center text-gray-900 text-lg font-semibold">Invite a User</h3>
      </div>

      <form
        className="max-w-[var(--form-width)] border p-8 pt-6 rounded-b-xl mx-auto mb-20"
        onSubmit={formik.handleSubmit}
        autoComplete="off"
      >
        <div className={`grid gap-2 mb-6 md:grid-cols-3 max-w-[500px] mx-auto items-center`}>
          <div className="md:col-span-2">
            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900">
              Phone
            </label>
            <input
              type="number"
              autoFocus
              id="phone"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="phone number"
              autoComplete="off"
              disabled={isLoading}
              onChange={(e) => {
                formik.handleChange(e);
                handlePhoneNumberLookup(e.target.value);
              }}
              value={formik.values.phone}
            />
            <span className="pl-2 text-sm text-red-600">
              {formik.touched.phone && formik.errors.phone}
              {!formik.errors.phone && (isNewUser === false ? 'User already exists' : '')}
              {!formik.errors.phone && isCheckingPhone && (
                <>
                  <span className="text-gray-700">Checking </span>
                  <span
                    className="inline-block border-gray-500 h-3 w-3 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                  ></span>
                </>
              )}
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="text-white self-center bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm max-w-[180px] px-5 py-2.5 text-center"
          >
            <span className="text-[15px]" style={{ letterSpacing: '0.3px' }}>
              {isLoading ? <LoadingSpinnerButton /> : 'Invite User'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Invitation;
