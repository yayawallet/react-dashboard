import { useState, useEffect } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import avater from '../../../assets/avater.svg';
import { User } from '../../../models';
import * as XLSX from 'xlsx';

const CreateContract = () => {
  const [contractID, setContractID] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [noUserFound, setNOUserFound] = useState(false);
  const [selectedReceiver, setSelectedReceiver] = useState<User>();
  const [inputFormType, setInputFormType] = useState('one'); // one or multiple
  const [inputFileLocation, setInputFileLocation] = useState('online'); // online or local
  // Bulk import
  const [excelFile, setExcelFile] = useState(null);
  const [excelData, setExcelData] = useState(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(selectedFile);
      reader.onload = (e) => setExcelFile(e.target.result);
    }
  };

  const handleInputChange = () => {};

  // console.log({ inputFileLocation });

  // const handleFileChange = (e) => {
  //   console.log(inputFileLocation);
  //   if (inputFileLocation === 'online') formik1.setFieldValue(excel_file, '');
  //   else if (inputFileLocation === 'local')
  //     formik1.setFieldValue(excel_url, '');
  // };

  const formik1 = useFormik({
    initialValues: {
      excel_url: '',
      excel_file: '',
    },

    validationSchema: Yup.object({
      excel_url: Yup.string().url('Invalid URL'),
      excel_file: Yup.mixed()
        .required('Required')
        .test('fileFormat', 'Only Excel files are allowed', (value) => {
          if (value) {
            const supportedFormats = ['xlsx', 'xls', 'csv', 'tsv'];
            return supportedFormats.includes(value.split('.').pop());
          }
          return true;
        }),
    }),

    onSubmit: (values) => {
      console.log(values);

      const workbook = XLSX.read(excelFile, { type: 'buffer' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(data.slice(0, 10));
    },
  });

  const formik = useFormik({
    initialValues: {
      contract_number: '',
      service_type: '',
      customer_account_name: '',
      meta_data: '',
    },

    validationSchema: Yup.object({
      contract_number: Yup.string()
        .max(50, 'Must be 50 characters or less')
        .required('Required'),
      service_type: Yup.string().required('Required'),
      customer_account_name: Yup.string()
        .max(50, 'Must be 50 characters or less')
        .required('Required'),
      meta_data: Yup.string().max(200, 'Must be 200 characters or less'),
    }),

    onSubmit: (values) => {
      setLoading(true);
      setUsersList([]);

      // Clear existing values
      setErrorMessage('');

      axios
        .post(
          `${import.meta.env.VITE_BASE_URL}/recurring-contract/create`,
          values
        )
        .then((res) => {
          setContractID(res.data.contract_id);
          setLoading(false);

          // clear input fields
          formik.resetForm();
        })
        .catch((error) => {
          setErrorMessage(error.response?.data.error || error.message),
            setLoading(false);
        });
    },
  });

  useEffect(() => {
    if (formik.values.customer_account_name.length < 3) return setUsersList([]);
    // reset NoUserFound
    setNOUserFound(false);

    axios
      .post(`${import.meta.env.VITE_BASE_URL}/user/search`, {
        query: formik.values.customer_account_name,
      })
      .then((res) => {
        setUsersList(res.data.slice(0, 5));
        if (res.data.length === 0) setNOUserFound(true);
      });
  }, [formik.values.customer_account_name]);

  return (
    <div className="container">
      <h1 className="text-2xl font-semibold p-2 mb-5">Recurring Contract</h1>

      {errorMessage && (
        <div
          className="flex items-center p-4 mb-10 text-sm text-red-800 rounded-lg bg-red-50"
          role="alert"
        >
          <svg
            className="flex-shrink-0 inline w-4 h-4 me-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium mr-2">Unsuccessful Process!</span>
            {errorMessage}
          </div>
        </div>
      )}

      {contractID && (
        <div
          className="flex items-center p-4 mb-10 text-sm text-blue-800 rounded-lg bg-blue-50"
          role="alert"
        >
          <svg
            className="flex-shrink-0 inline w-4 h-4 me-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium mr-2">
              Recurring contract created successfully!
            </span>
            Scheduled Payment ID: {contractID}
          </div>
        </div>
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
        <form className="max-w-md ml-10 mt-16" onSubmit={formik.handleSubmit}>
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
              {formik.touched.customer_account_name &&
                formik.errors.customer_account_name}
            </span>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <div className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 py-2 outline-none">
              {usersList?.slice(0, 5).map((user) => (
                <div
                  key={user.account}
                  className="flex gap-2 items-center p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    formik.setFieldValue('customer_account_name', user.account);
                    setSelectedReceiver(user);
                    setUsersList([user]);
                  }}
                >
                  <img
                    src={user.photo_url || avater}
                    alt=""
                    className="h-8 w-8 rounded-full"
                  />
                  <span>{user.name}</span>
                </div>
              ))}

              {noUserFound && (
                <span className="block text-sm pl-4">No users found.</span>
              )}
            </div>
          </div>

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
                {formik.touched.contract_number &&
                  formik.errors.contract_number}
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
            disabled={noUserFound || !selectedReceiver || isLoading}
            className="text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {isLoading ? 'Please wait...' : 'Create Contract'}
          </button>
        </form>
      ) : (
        <div className="">
          <div className="mt-5 p-10">
            <p className="text-gray-800">
              <span className="font-semibold">Instruction: </span>
              <li>
                Your file must be in either of the following formats:
                <span className="font-semibold"> xlsx, xls, csv, tsv</span>
              </li>
              <li>
                Your file must have the following columns:{' '}
                <span className="font-semibold">
                  customer_account_name, service_type, contract_number
                </span>{' '}
                and one more optional column for{' '}
                <span className="font-semibold">meta_data</span>
              </li>
            </p>
          </div>

          <form className="max-w-md ml-10" onSubmit={formik1.handleSubmit}>
            <div className="relative z-0 w-full mb-10 group">
              <input
                type="Text"
                id="excel_url"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                autoComplete="off"
                disabled={isLoading}
                onChange={(e) => {
                  formik1.handleChange(e);
                  // handleFileChange(e);
                  setInputFileLocation('online');
                  // setExcelFile(null);
                  handleInputChange();
                }}
                value={formik1.values.excel_url}
              />
              <label
                htmlFor="excel_url"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                File URL
              </label>

              <span className="text-xs text-red-600">
                {formik1.touched.excel_url && formik1.errors.excel_url}
              </span>
            </div>

            <div className="mb-2 text-gray-600 flex items-center align-top h-80">
              <input type="checkbox" name="" id="" className="w-4 h-4" />
              <span className="ml-1">or upload a file from your computer</span>
            </div>

            <div className="relative z-0 w-full mb-10 group">
              <input
                type="file"
                name="excel_file"
                id="excel_file"
                placeholder="Upload Excel file"
                className="w-full px-2 py-1 border-2 rounded border-gray-300 focus:border-blue-600 outline-none"
                disabled={isLoading}
                onChange={(e) => {
                  formik1.handleChange(e);
                  setInputFileLocation('local');
                  // handleFile(e);
                  // handleFileChange(e);
                  handleInputChange();
                }}
                value={formik1.values.excel_file}
              />
              <span className="text-xs text-red-600">
                {formik1.touched.excel_file && formik1.errors.excel_file}
              </span>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              {isLoading ? 'Please wait...' : 'Process File'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateContract;
