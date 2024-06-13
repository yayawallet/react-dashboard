import { ReactNode } from 'react';
import { authAxios } from '../api/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

interface Props {
  isLoading: boolean;
  instruction?: string | ReactNode;
  apiEndpoint: string;
  onLoading: (value: boolean) => void;
  onError: (value: string) => void;
  onSuccess: (value: string) => void;
}

const BulkImport = ({
  isLoading,
  instruction,
  apiEndpoint,
  onLoading,
  onError,
  onSuccess,
}: Props) => {
  const formik = useFormik({
    initialValues: {
      excel_file: '',
      remark: '',
    },

    validationSchema: Yup.object({
      excel_file: Yup.mixed().required('Required'),
      remark: Yup.string().required('Required').max(50, 'Remark must be less than 20 characters'),
    }),

    onSubmit: (values) => {
      onLoading(true);
      onSuccess('');
      onError('');

      const formData = new FormData();
      formData.append('file', values.excel_file);
      formData.append('remark', values.remark);

      authAxios
        .post(`/${apiEndpoint}`, formData)
        .then(() => {
          onError('');
          onSuccess('Your file is uploaded successfully.');
        })
        .catch((err) => {
          onSuccess('');
          onError('Failed to upload your file.');
          console.log(err);
        })
        .finally(() => {
          onLoading(false);
          formik.resetForm();
        });
    },
  });

  return (
    <div className="">
      <div className="mt-5 p-10">
        <p className="text-gray-800">
          <span className="font-semibold">Instruction: </span>
          <li>
            Your file must be in either of the following formats:
            <span className="font-semibold"> xlsx, xls, csv, tsv</span>
          </li>
          {instruction && <li>{instruction}</li>}
          <button
            disabled={isLoading}
            className="mt-2 text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2 text-center"
          >
            Download sample file
          </button>
        </p>
      </div>

      <form className="max-w-lg ml-10" onSubmit={formik.handleSubmit}>
        <div className="grid md:grid-cols-5 md:gap-10">
          <div className="relative z-0 w-full mb-10 group col-span-3">
            <input
              type="file"
              name="excel_file"
              id="excel_file"
              accept=".xlsx, .xls, .csv, .tsv"
              placeholder="Upload Excel file"
              className="w-full px-2 py-1 border-2 rounded border-gray-300 focus:border-blue-600 outline-none"
              disabled={isLoading}
              onChange={(e) =>
                formik.setFieldValue('excel_file', e.target.files && e.target.files[0])
              }
            />
            <span className="text-sm text-red-600">{formik.errors.excel_file}</span>
          </div>

          <div className="relative z-0 w-full mb-10 group col-span-2">
            <input
              type="text"
              id="remark"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              autoComplete="off"
              disabled={isLoading}
              onChange={formik.handleChange}
              value={formik.values.remark}
            />
            <label
              htmlFor="remark"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-2 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Remark
            </label>

            <span className="text-xs text-red-600">
              {formik.touched.remark && formik.errors.remark}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          {isLoading ? 'Please wait...' : 'Upload File'}
        </button>
      </form>
    </div>
  );
};

export default BulkImport;
