import { useState } from 'react';
import { authAxios } from '../api/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { QRCode } from '../models';
import InlineNotification from '../components/InlineNotification';

const GenerateQRCode = () => {
  const [QRCode, setQRCode] = useState<QRCode>();
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentLinkCopied, setPaymentLinkCopied] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const copyPaymentLink = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigator.clipboard.writeText(QRCode?.payment_link || '');
    setPaymentLinkCopied(true);

    setTimeout(() => {
      setPaymentLinkCopied(false);
      (e.target as HTMLButtonElement).blur();
    }, 2000);
  };

  const formik = useFormik({
    initialValues: {
      amount: '',
      cause: '',
    },

    validationSchema: Yup.object({
      amount: Yup.number().required('Required').min(1, 'Amount must cannot be less than 1.00'),
      cause: Yup.string().max(50, 'Must be 50 characters or less').required('Required'),
    }),

    onSubmit: (values) => {
      setLoading(true);

      // Clear existing values
      setErrorMessage('');
      setQRCode(undefined);

      authAxios
        .post('/transaction/qr-generate', values)
        .then((res) => {
          setQRCode(res.data);

          // clear input fields
          formik.resetForm();
        })
        .catch((error) => {
          setErrorMessage(
            error.response?.data?.message || error.response?.data?.error || error.message
          );
        })
        .finally(() => setLoading(false));
    },
  });

  return (
    <div className="page-container">
      <h1 className="text-2xl font-semibold p-2 mb-10">Generate QR Code</h1>

      {errorMessage && <InlineNotification type="error" info={errorMessage} />}

      {QRCode && (
        <div className="inline-flex flex-col rounded-lg md:ml-10 -mt-10">
          <img src={QRCode.qr_image_url} alt="QR Code URL" className="h-60 md:h-80 lg:h-96" />
          <p className="text-sm">
            <span className="font-semibold">Payment Link:</span>{' '}
            <span className="px-1 pb-0.5 text-white bg-violet-600 rounded">
              {QRCode.payment_link}
            </span>
            <button
              onClick={(e) => copyPaymentLink(e)}
              className="ml-2 px-1.5 mt-2 pb-0.5 text-violet-900 bg-violet-50 hover:bg-violet-200 border-2 border-violet-600 rounded focus:ring-2 focus:outline-none focus:ring-violet-300"
            >
              {paymentLinkCopied ? 'copied!' : 'copy'}
            </button>
          </p>
        </div>
      )}

      <div className="flex justify-center lg:mr-40 mt-6">
        <form
          className="w-[var(--form-width-small)] border p-8 pt-6 rounded-xl mb-20"
          onSubmit={formik.handleSubmit}
        >
          <div className="grid gap-6 md:grid-cols-5 mb-6">
            <div className="md:col-span-2">
              <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900">
                Amount
              </label>
              <input
                type="number"
                step="any"
                id="amount"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="amount"
                autoComplete="off"
                disabled={isLoading}
                onChange={formik.handleChange}
                value={formik.values.amount}
              />
              <span className="text-sm text-red-600">
                {formik.touched.amount && formik.errors.amount}
              </span>
            </div>

            <div className="md:col-span-3">
              <label htmlFor="cause" className="block mb-2 text-sm font-medium text-gray-900">
                Reason
              </label>
              <input
                type="text"
                id="cause"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="reason"
                autoComplete="off"
                disabled={isLoading}
                onChange={formik.handleChange}
                value={formik.values.cause}
              />
              <span className="text-sm text-red-600">
                {formik.touched.cause && formik.errors.cause}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-[200px] px-5 py-2.5 text-center"
          >
            <span style={{ letterSpacing: '0.3px' }}>
              {isLoading ? 'Please wait...' : 'Generate QR Code'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default GenerateQRCode;
