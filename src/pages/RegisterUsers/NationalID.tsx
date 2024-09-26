import { useContext, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { authAxios } from '../../api/axios';
import InlineNotification from '../../components/InlineNotification';
import VerifyOTP from './VerifyOTP';
import { RegistrationContext } from './Index';
import LoadingSpinnerButton from '../../components/ui/LoadingSpinnerButton';
import { useOutlet } from 'react-router-dom';
import YaYaLogoComponent from './YaYaLogoComponent';

const NationalID = () => {
  const outlet = useOutlet();
  // @ts-ignore
  const { store, setStore } = useContext(RegistrationContext);

  const [OTPSent, setOTPSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      fin: '',
    },

    validationSchema: Yup.object().shape({
      fin: Yup.string()
        .test('length', 'Must be 12 or 16 characters', (val) =>
          val ? val.length === 12 || val.length === 16 : false
        )
        .required('Enter Fayda Identification Number'),
    }),

    onSubmit: (values) => {
      setLoading(true);

      // Clear existing values
      setOTPSent(false);
      setErrorMessage('');
      setStore({});

      authAxios
        .get(`kyc/fayda/request-otp/${values.fin}`)
        .then((res) => {
          setOTPSent(true);
          setStore({
            fin: res.data.fin,
            transaction_id: res.data.transaction_id,
            registrationMethod: 'national-id',
          });
        })
        .catch((error) =>
          setErrorMessage(
            error.response?.data?.error || error.response?.data?.message || error.message
          )
        )
        .finally(() => setLoading(false));
    },
  });

  if (OTPSent) return <VerifyOTP />;
  if (outlet) return outlet;

  return (
    <div>
      {errorMessage && <InlineNotification type="error" info={errorMessage} />}

      <div className="border border-b-0 rounded-t-xl p-2 px-5 max-w-[var(--form-width)] mx-auto bg-gray-50 mt-6">
        <h3 className="py-2 text-center text-gray-900 text-lg font-semibold">Fayda - Nation ID</h3>
      </div>

      <form
        className="max-w-[var(--form-width)] border p-8 pt-6 rounded-b-xl mx-auto mb-20"
        onSubmit={formik.handleSubmit}
        autoComplete="off"
      >
        <div className={`grid gap-2 mb-6 md:grid-cols-3 max-w-[500px] mx-auto items-center`}>
          <div className="md:col-span-2">
            <label htmlFor="fin" className="block mb-2 text-sm font-medium text-gray-900">
              FIN/FCN
            </label>
            <input
              type="text"
              autoFocus
              id="fin"
              maxLength={16}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Fayda Indentification Number"
              autoComplete="off"
              disabled={isLoading}
              onChange={formik.handleChange}
              value={formik.values.fin}
            />
            <span className="pl-2 text-sm font-medium text-red-600">
              {formik.touched.fin && formik.errors.fin}
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="text-white self-center bg-yayaBrand-700 hover:bg-yayaBrand-800 focus:ring-4 focus:outline-none focus:ring-yayaBrand-300 font-medium rounded-lg text-sm max-w-[180px] px-5 py-2.5 text-center"
          >
            <span className="text-[15px]" style={{ letterSpacing: '0.3px' }}>
              {isLoading ? <LoadingSpinnerButton /> : 'Get OTP'}
            </span>
          </button>
        </div>
      </form>

      <YaYaLogoComponent />
    </div>
  );
};

export default NationalID;
