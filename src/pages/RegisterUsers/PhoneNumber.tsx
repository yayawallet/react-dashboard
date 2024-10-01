import { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { authAxios } from '../../api/axios';
import { RegistrationContext } from './Index';
import AccountType from './AccountType';
import { useOutlet } from 'react-router-dom';
import YaYaLogoComponent from './YaYaLogoComponent';

const PhoneNumber = () => {
  const outlet = useOutlet();
  // @ts-ignore
  const { store, setStore } = useContext(RegistrationContext);

  const [goNextStep, setGoNextStep] = useState(false);
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);

  const handlePhoneNumberLookup = (number: string) => {
    setIsNewUser(null);

    if (number.length < 9) return;

    if (number.startsWith('0') && number.length < 10) return;
    if ((number.startsWith('7') || number.startsWith('9')) && number.length < 9) return;

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
      fin: 'AGENT',
      country: 'Ethiopia',
    },

    validationSchema: Yup.object().shape({
      phone: Yup.string()
        .matches(
          /(^\+?251\d{9}$)|(^0(9|7)\d{8}$|^(9|7)\d{8}$)/, // Ethiopian phone number
          'Invalid phone number'
        )
        .required('phone number is required'),
      fin: Yup.string().required('fin is required'),
      country: Yup.string().required('country is required'),
    }),

    onSubmit: (values) => {
      if (!isNewUser) return;

      setStore({
        phone: values.phone,
        country: values.country,
        fin: values.fin,
        registrationMethod: 'phoneNumber',
      });

      formik.resetForm();
      setGoNextStep(true);
    },
  });

  if (goNextStep) return <AccountType onFinish={() => setGoNextStep(false)} />;
  if (outlet) return outlet;

  return (
    <div>
      <div className="border border-b-0 rounded-t-xl p-2 px-5 max-w-[var(--form-width)] mx-auto bg-gray-50 mt-6">
        <h3 className="py-2 text-center text-gray-900 text-lg font-semibold">Phone Number</h3>
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

            <div className="relative">
              <span className="absolute top-3 left-2 text-sm text-gray-500 pointer-events-none">
                +251
              </span>
            </div>

            <input
              type="number"
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                const phoneNumber = target.value;
                target.value =
                  phoneNumber[0] === '0' ? phoneNumber.slice(0, 10) : phoneNumber.slice(0, 9);

                if (phoneNumber[0] !== '0' && phoneNumber[0] !== '7' && phoneNumber[0] !== '9')
                  formik.setTouched({ phone: true });
                else if (phoneNumber[0] === '0' && phoneNumber.length === 10)
                  formik.setTouched({ phone: true });
                else if (phoneNumber.length === 9) formik.setTouched({ phone: true });
              }}
              autoFocus
              id="phone"
              className="pl-12 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Phone number"
              autoComplete="off"
              onChange={(e) => {
                formik.handleChange(e);
                handlePhoneNumberLookup(e.target.value);
              }}
              value={formik.values.phone}
            />
            <span className="pl-2 text-sm font-medium text-red-600">
              {formik.touched.phone && formik.errors.phone}
              {!formik.errors.phone && (isNewUser === false ? 'User already exists' : '')}
              {!formik.errors.phone && isCheckingPhone && (
                <>
                  <span
                    className="inline-block border-gray-500 h-3 w-3 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                  ></span>
                  <span className="text-gray-700"> Checking</span>
                </>
              )}
            </span>
          </div>

          <button
            type="submit"
            className="text-white self-center bg-yayaBrand-700 hover:bg-yayaBrand-800 focus:ring-4 focus:outline-none focus:ring-yayaBrand-300 font-medium rounded-lg text-sm max-w-[180px] px-5 py-2.5 text-center"
          >
            <span className="text-[15px]" style={{ letterSpacing: '0.3px' }}>
              NEXT
            </span>
          </button>
        </div>
      </form>

      <YaYaLogoComponent />
    </div>
  );
};

export default PhoneNumber;
