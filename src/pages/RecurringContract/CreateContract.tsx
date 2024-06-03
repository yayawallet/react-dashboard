import { useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import BulkImport from '../../components/BulkImport';
import SearchUserInline from '../../components/SearchUserInline';
import InlineNotification from '../../components/InlineNotification';
import useAccessToken from '../../hooks/useAccessToken';

const CreateContract = () => {
  const [contractID, setContractID] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [inputFormType, setInputFormType] = useState('one'); // one or multiple

  const { accessToken } = useAccessToken();
  console.log(accessToken);

  const handleOnLoading = (value: boolean) => setLoading(value);
  const handleOnError = (value: string) => setErrorMessage(value);
  const handleOnSuccess = (value: string) => setSuccessMessage(value);

  const formik = useFormik({
    initialValues: {
      contract_number: '',
      service_type: '',
      customer_account_name: '',
      meta_data: '',
    },

    validationSchema: Yup.object({
      contract_number: Yup.string().max(50, 'Must be 50 characters or less').required('Required'),
      service_type: Yup.string().required('Required'),
      customer_account_name: Yup.string()
        .max(50, 'Must be 50 characters or less')
        .required('Required'),
      meta_data: Yup.string().max(200, 'Must be 200 characters or less'),
    }),

    onSubmit: (values) => {
      setLoading(true);

      // Clear existing values
      setContractID('');
      setSuccessMessage('');
      setErrorMessage('');

      values.customer_account_name = selectedUser;
      axios
        .post(`${import.meta.env.VITE_BASE_URL}/recurring-contract/create`, values, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((res) => {
          setContractID(res.data.contract_id);
          setLoading(false);

          // clear input fields
          formik.resetForm();
        })
        .catch((error) => {
          setErrorMessage(error.response?.data.error || error.message), setLoading(false);
        });
    },
  });

  return (
    <div className="container">
      <h1 className="text-2xl font-semibold p-2 mb-5">Recurring Contract</h1>

      {errorMessage && <InlineNotification type="error" info={errorMessage} />}

      {(contractID || successMessage) && (
        <InlineNotification
          type="success"
          info={`${successMessage ? successMessage : `Contract ID: ${contractID}`}`}
        />
      )}

      <div className="border-2 rounded-lg p-2 px-5">
        <div className="flex gap-x-4 my-2 justify-end">
          <button
            className={`flex flex-wrap items-center gap-x-2 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-1.5 text-center ${inputFormType === 'one' ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'text-violet-900 border-2 border-violet-600 hover:bg-violet-100'}`}
            onClick={() => setInputFormType('one')}
          >
            <input
              id="oneInput"
              type="radio"
              name="input-type"
              className="w-4 h-4 cursor-pointer"
              checked={inputFormType === 'one'}
              onChange={() => setInputFormType('one')}
            />
            <label htmlFor="topupFor" className="cursor-pointer">
              Single Contract
            </label>
          </button>

          <button
            className={`flex flex-wrap items-center gap-x-2 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-1.5 text-center ${inputFormType === 'multiple' ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'text-violet-900 border-2 border-violet-600 hover:bg-violet-100'}`}
            onClick={() => setInputFormType('multiple')}
          >
            <input
              id="multipleInput"
              type="radio"
              name="input-type"
              className="w-4 h-4 cursor-pointer"
              checked={inputFormType === 'multiple'}
              onChange={() => setInputFormType('multiple')}
            />
            <label htmlFor="forOther" className="cursor-pointer">
              Multiple Contracts
            </label>
          </button>
        </div>
      </div>

      {inputFormType === 'one' ? (
        <form className="max-w-lg ml-10 mt-16" onSubmit={formik.handleSubmit}>
          <div className="relative z-0 w-full mb-1 group">
            <input
              type="Text"
              id="customer_account_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              autoComplete="off"
              disabled={isLoading}
              onChange={formik.handleChange}
              value={formik.values.customer_account_name}
            />
            <label
              htmlFor="customer_account_name"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Customer Account Number
            </label>

            <span className="text-xs text-red-600">
              {formik.touched.customer_account_name && formik.errors.customer_account_name}
            </span>
          </div>

          <SearchUserInline
            query={formik.values.customer_account_name}
            onSelecteUser={(value) => setSelectedUser(value)}
            onUserNotFound={(value) => setUserNotFound(value)}
          />

          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative z-0 w-full mb-10 group">
              <input
                type="text"
                id="service_type"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                autoComplete="off"
                disabled={isLoading}
                onChange={formik.handleChange}
                value={formik.values.service_type}
              />
              <label
                htmlFor="service_type"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Service Type
              </label>

              <span className="text-xs text-red-600">
                {formik.touched.service_type && formik.errors.service_type}
              </span>
            </div>

            <div className="relative z-0 w-full mb-10 group">
              <input
                type="text"
                id="contract_number"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                autoComplete="off"
                disabled={isLoading}
                onChange={formik.handleChange}
                value={formik.values.contract_number}
              />
              <label
                htmlFor="contract_number"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Contract Number
              </label>

              <span className="text-xs text-red-600">
                {formik.touched.contract_number && formik.errors.contract_number}
              </span>
            </div>
          </div>

          <div className="relative z-0 w-full mb-10 group">
            <textarea
              rows={3}
              name="meta_data"
              id="meta_data"
              placeholder="Any meta_data in JSON Format"
              className="w-full px-2 py-1 border-2 rounded border-gray-300 focus:border-blue-600 outline-none"
              autoComplete="off"
              disabled={isLoading}
              onChange={formik.handleChange}
              value={formik.values.meta_data}
            ></textarea>
            <span className="text-xs text-red-600">
              {formik.touched.meta_data && formik.errors.meta_data}
            </span>
          </div>

          <button
            type="submit"
            disabled={userNotFound || !selectedUser || isLoading}
            className="text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {isLoading ? 'Please wait...' : 'Create Contract'}
          </button>
        </form>
      ) : (
        <BulkImport
          isLoading={isLoading}
          apiEndpoint="recurring-contract/bulk-import-contract"
          onLoading={handleOnLoading}
          onError={handleOnError}
          onSuccess={handleOnSuccess}
          instruction={
            <>
              Your file must have the following columns:{' '}
              <span className="font-semibold">
                customer_account_name, service_type, contract_number
              </span>{' '}
              and <span className="font-semibold">meta_data</span> (optional)
            </>
          }
        />
      )}
    </div>
  );
};

export default CreateContract;
