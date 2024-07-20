import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { EXternalAccount } from '../../models';
import InlineNotification from '../../components/InlineNotification';
import { authAxios } from '../../api/axios';
import InstitutionLIst from '../../components/InstitutionLIst';

const ExternalAccountLookup = () => {
  const [externalAccount, setExternalAccount] = useState<EXternalAccount>();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);

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

      authAxios
        .post(`/transfer/lookup-external`, values)
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
    <div className="page-container">
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

      <div className="flex justify-center lg:mr-32 mt-6">
        <form
          className="w-[var(--form-width-small)] border p-8 pt-6 rounded-xl mb-20"
          onSubmit={formik.handleSubmit}
        >
          <div className="grid gap-6 md:grid-cols-2 mb-6">
            <div>
              <InstitutionLIst
                onSelect={(value) => formik.setFieldValue('institution_code', value)}
              />
              <span className="text-sm text-red-600">
                {formik.touched.institution_code && formik.errors.institution_code}
              </span>
            </div>

            <div>
              <input
                type="text"
                id="account_number"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="account_number"
                autoComplete="off"
                disabled={isLoading}
                onChange={formik.handleChange}
                value={formik.values.account_number}
              />

              <span className="text-sm text-red-600">
                {formik.touched.account_number && formik.errors.account_number}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-[200px] px-5 py-2.5 text-center"
          >
            <span style={{ letterSpacing: '0.3px' }}>
              {isLoading ? 'Please wait...' : 'Lookup'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ExternalAccountLookup;
