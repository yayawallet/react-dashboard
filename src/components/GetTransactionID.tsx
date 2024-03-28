import { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

const GetTransactionByID = () => {
  const [transaction, setTransaction] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState("");

  console.log({ transaction });
  console.log({ errorMessage });

  const formik = useFormik({
    initialValues: {
      transactionID: "",
    },

    validationSchema: Yup.object({
      transactionID: Yup.string()
        .max(50, "Must be 50 characters or less")
        .required("Required"),
    }),

    onSubmit: (values) => {
      // Clear existing alerts
      setErrorMessage("");
      setTransaction(undefined);

      axios
        .post("http://localhost:4000/getTransactionById", values)
        .then((res) => {
          setTransaction(res.data);
          setErrorMessage("");

          // clear input fields
          formik.resetForm();
        })
        .catch((error) => {
          setTransaction(undefined);
          setErrorMessage(error.response?.data.error || error.message);
        });
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold p-2 mb-5">
        Verify Transaction IDs
      </h1>

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

      {/* {transactionID && (
        <div
          className="flex items-center p-4 mb-10 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
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
            <span className="font-medium mr-2">Successful transaction!</span>
            Transaction ID: {transactionID}
          </div>
        </div>
      )} */}

      <form className="max-w-md mx-auto" onSubmit={formik.handleSubmit}>
        <div className="relative z-0 w-full mb-10 group">
          <input
            type="Text"
            id="transactionID"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            onChange={formik.handleChange}
            value={formik.values.transactionID}
          />
          <label
            htmlFor="transactionID"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Transaction ID
          </label>

          <span className="text-xs text-red-600">
            {formik.touched.transactionID && formik.errors.transactionID}
          </span>
        </div>

        <button
          type="submit"
          className="text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Verify
        </button>
      </form>
    </div>
  );
};

export default GetTransactionByID;
