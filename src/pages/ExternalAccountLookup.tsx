import { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Institution, EXternalAccount } from '../models';
import InlineNotification from '../components/InlineNotification';
import useAccessToken from '../hooks/useAccessToken';

const ExternalAccountLookup = () => {
  const [financialInstitutionList, setFinancialInstitutionList] = useState<Institution[]>([]);
  const [externalAccount, setExternalAccount] = useState<EXternalAccount>();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);

  const { accessToken } = useAccessToken();

  useEffect(() => {
    axios
      .post(
        `${import.meta.env.VITE_BASE_URL}/financial-institution/list`,
        {
          country: 'Ethiopia',
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then((res) => setFinancialInstitutionList(res.data))
      .catch((error) => setErrorMessage(error.response?.data.error || error.message));
  }, []);

  const formik = useFormik({
    initialValues: {
      institution_code: '',
      account_number: '',
    },

    validationSchema: Yup.object({
      institution_code: Yup.string().required('Required'),
      account_number: Yup.string().required('Required'),
    }),

    onSubmit: (values) => {
      setLoading(true);

      // Clear existing values
      setErrorMessage('');
      setExternalAccount(undefined);

      axios
        .post(`${import.meta.env.VITE_BASE_URL}/transfer/lookup-external`, values, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((res) => {
          setExternalAccount(res.data);
          setLoading(false);

          // clear input fields
          formik.resetForm();
        })
        .catch((error) => {
          setErrorMessage(error.response?.data.error || error.message);
          setLoading(false);
        });
    },
  });

  return (
    <div className="container">
      <h1 className="text-2xl font-semibold p-2 mb-10">External Account Lookup</h1>

      {errorMessage && <InlineNotification type="error" info={errorMessage} />}

      {externalAccount && (
        <div className="bg-white overflow-hidden shadow rounded-lg border mb-10">
          <div className="flex flex-wrap justify-between px-4 py-5 sm:px-6">
            <div className="">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {externalAccount.institution.name}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {'code: ' + externalAccount.institution.code}
                <br />
                {'Id: ' + externalAccount.institution.institution_id}
              </p>
            </div>

            <div className="h-20">
              <img
                src={externalAccount.institution.logo_url}
                alt="Institution Logo"
                className="h-full"
              />
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {externalAccount.full_name}
                </dd>
              </div>
              <div className="py-3 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Account Number</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {externalAccount.account_number}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      <form
        className="max-w-lg ml-10 mt-16 shadow shadow-gray-300 px-10 py-6 rounded-lg"
        onSubmit={formik.handleSubmit}
      >
        <div className="grid md:grid-cols-2 md:gap-6 mt-10">
          <div className="relative z-0 w-full mb-10 group">
            <select
              id="institution_code"
              className="w-full bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 outline-none"
              onChange={formik.handleChange}
              value={formik.values.institution_code}
            >
              <option label="Choose Institution code"></option>
              {financialInstitutionList?.map((list) => (
                <option key={list.code} value={list.code}>
                  {`${list.code} - ${list.name}`}
                </option>
              ))}
            </select>
            <span className="text-xs text-red-600">
              {formik.touched.institution_code && formik.errors.institution_code}
            </span>
          </div>

          <div className="relative z-0 w-full mb-10 group">
            <input
              type="string"
              id="account_number"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              disabled={isLoading}
              onChange={formik.handleChange}
              value={formik.values.account_number}
            />
            <label
              htmlFor="account_number"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Account Number
            </label>

            <span className="text-xs text-red-600">
              {formik.touched.account_number && formik.errors.account_number}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          {isLoading ? 'Please wait...' : 'Lookup Account'}
        </button>
      </form>
    </div>
  );
};

export default ExternalAccountLookup;
