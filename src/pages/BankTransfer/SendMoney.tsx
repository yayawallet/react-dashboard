import { useState } from 'react';
import { authAxios } from '../../api/axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InlineNotification from '../../components/InlineNotification';
import InstitutionLIst from '../../components/InstitutionLIst';
import { EXternalAccount } from '../../models';
import { MdOutlineAccountBox } from 'react-icons/md';

const CreateTransfer = () => {
  const [transferID, setTransferID] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [externalAccount, setExternalAccount] = useState<EXternalAccount>();

  const formik = useFormik({
    initialValues: {
      institution_code: '',
      account_number: '',
      amount: '',
      sender_note: '',
      ref_code: '',
    },

    validationSchema: Yup.object({
      institution_code: Yup.string().required('Select Institution'),
      account_number: Yup.string().required('Required').max(30, 'Must be less than 30 characters'),
      amount: Yup.number().required('Required').min(1, 'Amount cannot be less than 1.00'),
      sender_note: Yup.string().required('Required').max(128, 'Must be 128 characters or less'),
      ref_code: Yup.string(),
    }),

    onSubmit: (values) => {
      setLoading(true);

      // Clear existing values
      setErrorMessage('');
      setTransferID('');

      authAxios
        .post('/transfer/send', values)
        .then((res) => {
          setTransferID(res.data.id);

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

  const handleAccountLookup = () => {
    formik.setTouched({ institution_code: true, account_number: true });
    if (formik.errors.institution_code || formik.errors.account_number) return;

    setLoading(true);

    // Clear existing values
    setErrorMessage('');
    setExternalAccount(undefined);

    authAxios
      .post(`/transfer/lookup-external`, {
        institution_code: formik.values.institution_code,
        account_number: formik.values.account_number,
      })
      .then((res) => setExternalAccount(res.data))
      .catch((error) =>
        setErrorMessage(
          error.response?.data?.message || error.response?.data?.error || error.message
        )
      )
      .finally(() => setLoading(false));
  };

  return (
    <div className="page-container">
      <h1 className="text-2xl font-semibold p-2 mb-10">Transfer Money</h1>

      {errorMessage && <InlineNotification type="error" info={errorMessage} />}

      {transferID && (
        <div>
          <InlineNotification type="success" info={`Transfer ID: ${transferID}`} />
          <div className="w-[var(--form-width-small)]  mx-auto my-10">
            <button
              type="button"
              className="text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-[100px] px-5 py-2.5 text-center"
              onClick={() => {
                setExternalAccount(undefined);
                setTransferID('');
              }}
            >
              <span style={{ letterSpacing: '0.3px' }}>BACK</span>
            </button>
          </div>
        </div>
      )}

      <div
        className={`${transferID ? 'hidden' : ''} flex flex-col items-center justify-center lg:mr-32 mt-6`}
      >
        <form
          className="w-[var(--form-width-small)] border p-8 pt-6 rounded-xl mb-20"
          onSubmit={formik.handleSubmit}
        >
          {externalAccount && (
            <div className="flex items-center gap-x-2 ms-2 text-gray-800 mb-5 font-semibold">
              <span className="text-gray-600 text-lg mt-0.5">
                <MdOutlineAccountBox />
              </span>
              <div>{`${externalAccount?.full_name} - ${externalAccount?.account_number}`}</div>
            </div>
          )}

          <div className={`${externalAccount ? 'hidden' : ''} grid gap-6 md:grid-cols-2 mb-6`}>
            <div>
              <InstitutionLIst
                onSelect={(value) => formik.setFieldValue('institution_code', value)}
              />
              <span className="text-sm text-red-600">
                {formik.touched.institution_code && formik.errors.institution_code}
              </span>
            </div>

            <div>
              <input
                type="text"
                id="account_number"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Account Number"
                autoComplete="off"
                disabled={isLoading}
                onChange={formik.handleChange}
                value={formik.values.account_number}
                onKeyDown={(e) => (e.key === 'Enter' ? handleAccountLookup() : undefined)}
              />

              <span className="text-sm text-red-600">
                {formik.touched.account_number && formik.errors.account_number}
              </span>
            </div>
          </div>

          <div className={`${externalAccount ? '' : 'hidden'}`}>
            <div className="grid gap-6 md:grid-cols-2 mb-6">
              <div>
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

              <div>
                <label
                  htmlFor="sender_note"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Reason
                </label>
                <input
                  type="text"
                  id="sender_note"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder="reason"
                  autoComplete="off"
                  disabled={isLoading}
                  onChange={formik.handleChange}
                  value={formik.values.sender_note}
                />
                <span className="text-sm text-red-600">
                  {formik.touched.sender_note && formik.errors.sender_note}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="ref_code" className="block mb-2 text-sm font-medium text-gray-900">
                Reference code
                <span className="font-normal text-gray-400">&nbsp;(optional)</span>
              </label>
              <input
                type="text"
                id="ref_code"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Refrence code"
                autoComplete="off"
                disabled={isLoading}
                onChange={formik.handleChange}
                value={formik.values.ref_code}
              />
              <span className="text-sm text-red-600">
                {formik.touched.ref_code && formik.errors.ref_code}
              </span>
            </div>
          </div>

          <button
            type={`${externalAccount ? 'submit' : 'button'}`}
            disabled={isLoading}
            className="text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-[200px] px-5 py-2.5 text-center"
            onClick={() => (!externalAccount ? handleAccountLookup() : undefined)}
          >
            <span style={{ letterSpacing: '0.3px' }}>
              {isLoading ? 'Please wait...' : externalAccount ? 'Send Money' : 'NEXT'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTransfer;
