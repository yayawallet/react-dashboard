import { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

const TransferFee = () => {
  const [institution, setInstitution] = useState("");
  const [transferFee, setTransferFee] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      institution_code: "",
      amount: "",
    },

    validationSchema: Yup.object({
      institution_code: Yup.string().required("Required"),
      amount: Yup.number().required("Required"),
    }),

    onSubmit: (values) => {
      // Clear existing values
      setErrorMessage("");
      setTransferFee(undefined);
      setInstitution("");

      axios
        .post("http://localhost:4000/getTransferFee", values)
        .then((res) => {
          setInstitution(values.institution_code);
          setTransferFee(res.data);

          // clear input fields
          formik.resetForm();
        })
        .catch((error) =>
          setErrorMessage(error.response?.data.error || error.message),
        );
    },
  });

  return (
    <div className="container">
      <h1 className="text-2xl font-semibold p-2 mb-10">Check Transfer Fee</h1>

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
            <span className="font-medium mr-2">Error!</span>
            {errorMessage}
          </div>
        </div>
      )}

      {transferFee && (
        <div className="flex justify-center sm:-ml-10 rounded-lg mb-20">
          <p className="text-2xl">
            Transfer Fee to {institution}:
            <span className="text-6xl px-2">{transferFee.fee}</span>
            <span className="text-4xl font-thin">{transferFee.currency}</span>
          </p>
        </div>
      )}

      <form className="max-w-md mx-auto" onSubmit={formik.handleSubmit}>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-10 group">
            <input
              type="text"
              id="institution_code"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              onChange={formik.handleChange}
              value={formik.values.institution_code}
            />
            <label
              htmlFor="institution_code"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Institution Code
            </label>

            <span className="text-xs text-red-600">
              {formik.touched.institution_code &&
                formik.errors.institution_code}
            </span>
          </div>

          <div className="relative z-0 w-full mb-10 group">
            <input
              type="number"
              id="amount"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              onChange={formik.handleChange}
              value={formik.values.amount}
            />
            <label
              htmlFor="amount"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Amount
            </label>

            <span className="text-xs text-red-600">
              {formik.touched.amount && formik.errors.amount}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Check Fee
        </button>
      </form>
    </div>
  );
};

export default TransferFee;
