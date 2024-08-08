import { useState } from 'react';
import { authAxios } from '../../api/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Fee } from '../../models';
import InlineNotification from '../../components/InlineNotification';
import InstitutionLIst from '../../components/InstitutionLIst';

const TransferFee = () => {
  const [transferFee, setTransferFee] = useState<Fee>();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      institution_code: '',
      amount: '',
    },

    validationSchema: Yup.object({
      institution_code: Yup.string().required('Required'),
      amount: Yup.number().required('Required').min(1, 'Amount cannot be less than 1.00'),
    }),

    onSubmit: (values) => {
      setLoading(true);

      // Clear existing values
      setErrorMessage('');
      setTransferFee(undefined);

      authAxios
        .post(`/transfer/fee`, values)
        .then((res) => {
          setTransferFee(res.data);
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
      <h1 className="text-2xl font-semibold p-2 mb-10">Check Transfer Fee</h1>

      {errorMessage && <InlineNotification type="error" info={errorMessage} />}

      {transferFee && (
        <div className="max-w-[var(--form-width-small)] mx-auto sm:ml-10 md:ml-20 lg:ml-28">
          <p className="text-lg text-center md:mr-20">
            Transfer Fee is
            <span className="text-2xl px-2">{transferFee.fee.toFixed(2)}</span>
            <span className="text-xl text-gray-400 font-light">{transferFee.currency}</span>
          </p>
        </div>
      )}

      <div className="flex justify-center lg:mr-32 mt-6">
        <form
          className="w-[var(--form-width-small)] border p-8 pt-6 rounded-xl mb-20"
          onSubmit={formik.handleSubmit}
        >
          <div className="grid md:grid-cols-5 md:gap-6 mb-6">
            <div className="md:col-span-3">
              <InstitutionLIst
                onSelect={(value) => formik.setFieldValue('institution_code', value)}
              />
              <span className="text-sm text-red-600">
                {formik.touched.institution_code && formik.errors.institution_code}
              </span>
            </div>

            <div className="md:col-span-2">
              <input
                type="number"
                step="any"
                id="amount"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Amount"
                autoComplete="off"
                disabled={isLoading}
                onChange={formik.handleChange}
                value={formik.values.amount}
              />

              <span className="text-sm text-red-600">
                {formik.touched.amount && formik.errors.amount}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-[200px] px-5 py-2.5 text-center"
          >
            <span style={{ letterSpacing: '0.3px' }}>
              {isLoading ? 'Please wait...' : 'Check Fee'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransferFee;
