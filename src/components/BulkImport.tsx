import { ReactNode } from 'react';
import { authAxios } from '../api/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { BsDownload } from 'react-icons/bs';

interface Props {
  isLoading: boolean;
  instruction?: string | ReactNode;
  apiEndpoint: string;
  templateFile: string;
  approvalRequest?: boolean;
  onLoading: (value: boolean) => void;
  onError: (value: string) => void;
  onSuccess: (value: string) => void;
}

const BulkImport = ({
  isLoading,
  instruction,
  apiEndpoint,
  templateFile,
  approvalRequest,
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
      remark: Yup.string().required('Required').max(50, 'Remark must be less than 50 characters'),
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
          onSuccess(
            approvalRequest
              ? 'Approval Request Sent to Approvers.'
              : 'Your file is being processed.'
          );
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
    <div className="max-w-[var(--form-width)] mx-auto border rounded-b-xl mb-20">
      <div className="p-8 pt-6">
        <p className="text-gray-800">
          <span className="font-semibold">Instruction: </span>
          <li>
            Your file must be in either of the following formats:
            <span className="font-semibold"> xlsx, xls, csv, tsv</span>
          </li>
          {instruction && <li>{instruction}</li>}
          <li>
            <a
              href={templateFile}
              download={`downloaded_${templateFile.split('_').slice(-2).join('_')}`}
              className="inline-flex gap-x-2 items-center text-blue-600 hover:text-blue-700 hover:underline"
            >
              Download template file <BsDownload />
            </a>
          </li>
        </p>
      </div>

      <form className="p-8 pt-4 max-w-[var(--form-width-small)]" onSubmit={formik.handleSubmit}>
        <div className="mb-6">
          <label htmlFor="excel_file" className="block mb-2 text-sm font-medium text-gray-900">
            Upload file
          </label>
          <input
            aria-describedby="excel_file_input"
            name="excel_file"
            id="excel_file"
            accept=".xlsx, .xls, .csv, .tsv"
            type="file"
            disabled={isLoading}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            onChange={(e) =>
              formik.setFieldValue('excel_file', e.target.files && e.target.files[0])
            }
          />

          <span className="text-sm text-red-600">{formik.errors.excel_file}</span>
        </div>

        <div className="mb-6">
          <label htmlFor="remark" className="block mb-2 text-sm font-medium text-gray-900">
            Remark
          </label>
          <input
            type="text"
            id="remark"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Remark"
            autoComplete="off"
            onChange={formik.handleChange}
            value={formik.values.remark}
          />
          <span className="text-sm text-red-600">
            {formik.touched.remark && formik.errors.remark}
          </span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="text-white bg-yaya-700 hover:bg-yaya-800 focus:ring-4 focus:outline-none focus:ring-yaya-300 font-medium rounded-lg text-sm w-full sm:w-[200px] px-5 py-2.5 text-center"
        >
          <span className="text-[15px]" style={{ letterSpacing: '0.3px' }}>
            {isLoading ? 'Please wait...' : 'Upload File'}
          </span>
        </button>
      </form>
    </div>
  );
};

export default BulkImport;
