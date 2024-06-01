import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useAccessToken from '../hooks/useAccessToken';

interface Props {
  isLoading: boolean;
  instruction?: string;
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
  const { accessToken } = useAccessToken();

  const formik = useFormik({
    initialValues: {
      excel_file: '',
    },

    validationSchema: Yup.object({
      excel_file: Yup.string()
        .required('Required')
        .test('fileFormat', 'Only xlsx, xls, csv, and tsv file formats are allowed', (value) => {
          if (value) {
            const supportedFormats = ['xlsx', 'xls', 'csv', 'tsv'];
            return supportedFormats.includes(value.split('.')[1]);
          }
          return true;
        }),
    }),

    onSubmit: (values) => {
      onLoading(true);
      onSuccess('');
      onError('');

      axios
        .post(`${import.meta.env.VITE_BASE_URL}/${apiEndpoint}`, values, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then(() => {
          onError('');
          onSuccess('Your file is uploaded successfully.');
        })
        .catch(() => {
          onSuccess('');
          onError('Failed to upload your file.');
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
        </p>
      </div>

      <form className="max-w-md ml-10" onSubmit={formik.handleSubmit}>
        <div className="relative z-0 w-full mb-10 group">
          <input
            type="file"
            name="excel_file"
            id="excel_file"
            placeholder="Upload Excel file"
            className="w-full px-2 py-1 border-2 rounded border-gray-300 focus:border-blue-600 outline-none"
            disabled={isLoading}
            onChange={formik.handleChange}
            value={formik.values.excel_file}
          />
          <span className="text-sm text-red-600">{formik.errors.excel_file}</span>
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
