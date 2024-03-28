import { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

const CreateTransaction = () => {
  const [transactionID, setTransactionID] = useState(undefined);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:4000/createTransaction")
  //     .then((res) => setTransactionI(res.data));
  // }, []);

  const formik = useFormik({
    initialValues: {
      receiver: "",
      amount: "",
      cause: "",
    },

    validationSchema: Yup.object({
      receiver: Yup.string()
        .max(50, "Must be 50 characters or less")
        .required("Required"),
      amount: Yup.string()
        .max(20, "Must be 20,000 or less")
        .required("Required"),
      cause: Yup.string()
        .max(50, "Must be 50 characters or less")
        .required("Required"),
    }),

    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold p-2 mb-5">Make Transaction</h1>

      <form className="max-w-md mx-auto" onSubmit={formik.handleSubmit}>
        <div className="relative z-0 w-full mb-10 group">
          <input
            type="Text"
            id="receiver"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            onChange={formik.handleChange}
            value={formik.values.receiver}
          />
          <label
            htmlFor="receiver"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Receiver
          </label>

          <span className="text-xs text-red-600">
            {formik.touched.receiver && formik.errors.receiver}
          </span>
        </div>

        <div className="grid md:grid-cols-2 md:gap-6">
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
              {formik.touched.receiver && formik.errors.amount}
            </span>
          </div>

          <div className="relative z-0 w-full mb-10 group">
            <input
              type="text"
              id="cause"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              onChange={formik.handleChange}
              value={formik.values.cause}
            />
            <label
              htmlFor="cause"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Cause
            </label>

            <span className="text-xs text-red-600">
              {formik.touched.receiver && formik.errors.cause}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="text-white bg-purple-900 hover:bg-purple-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateTransaction;
