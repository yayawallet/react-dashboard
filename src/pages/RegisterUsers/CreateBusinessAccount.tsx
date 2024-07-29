import { useContext, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InlineNotification from '../../components/InlineNotification';
import { RegistrationContext } from './Index';
import SelectElement from '../../components/SelectElement';
import { IoMdBusiness } from 'react-icons/io';
import { useGetData } from '../../hooks/useSWR';
import CreateAccount from './CreateAccount';
import { authAxios } from '../../api/axios';
import LoadingSpinnerButton from '../../components/ui/LoadingSpinnerButton';
import { RiProfileFill } from 'react-icons/ri';

type LincenseType = { tin: 'string'; name: 'string'; license_number: 'string'; sector: 'string' };
const EthiopianRegions: { [key: string]: string } = {
  AA: 'Addis Ababa',
  AF: 'Afar',
  AM: 'Amhara',
  BG: 'Benishangul-Gumuz',
  DD: 'Dire Dawa',
  GM: 'Gambela',
  HR: 'Harari',
  OR: 'Oromia',
  SD: 'Sidama',
  SO: 'Somali',
  SWEP: 'SWEP',
  SNNP: 'SNNP',
  TG: 'Tigray',
};

const CreateBusinessAccount = () => {
  // @ts-ignore
  const { store, setStore } = useContext(RegistrationContext);

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isTINValid, setTINValid] = useState(false);
  const [businessVerified, setBusinessVerfied] = useState(false);
  const [licenseNumbers, setLicenseNumbers] = useState([]);
  const [licenseOwner, setLicenseOwner] = useState('');

  const { data: businessCategoryList } = useGetData('/lookup/business-categories');

  const handleGetLicenseNumber = () => {
    setErrorMessage('');
    setLoading(true);

    authAxios
      .get(`kyc/etrade/find-by-tin/${formik.values?.tin_number}`)
      .then((res) => {
        if (res.data?.length === 0) {
          setErrorMessage('No License Number is Available!');
          setTINValid(false);

          return;
        }

        const getLinceNumbers = res.data.map((license: LincenseType) => ({
          code: license.license_number,
          value: license.license_number,
        }));

        setLicenseNumbers(getLinceNumbers);

        if (getLinceNumbers.length === 1) {
          console.log('Yeah');
          formik.setFieldValue('license_number', getLinceNumbers[0].code);
        }

        console.log(res.data);

        setLicenseOwner(res.data[0].name);
        setTINValid(true);
      })
      .catch((error) => {
        setTINValid(false);
        setErrorMessage(
          error.response?.data?.error || error.response?.data?.message || 'Something Went Wrong!'
        );
      })
      .finally(() => setLoading(false));
  };

  const formik = useFormik({
    initialValues: {
      tin_number: '',
      license_number: '',
      mcc: '',
    },

    validationSchema: Yup.object().shape({
      tin_number: Yup.string().max(128, 'Too long').required('TIN Number is required'),
      license_number: Yup.string().max(128, 'Too long').required('Select License Number'),
      mcc: Yup.string().required('Specify your Business type'),
    }),

    onSubmit: (values) => {
      setErrorMessage('');
      setLoading(true);

      authAxios
        .post(`/kyc/etrade/find-by-license-number/${values.tin_number}`, {
          license_number: values.license_number,
        })
        .then((res) => {
          console.log(res.data);
          setBusinessVerfied(true);
          setStore({
            ...store,
            tin_number: values.tin_number,
            license_number: values.license_number,
            mcc: values.mcc,
            name: res.data.AssociateShortInfos[0].ManagerNameEng,
            photo: res.data.AssociateShortInfos[0].Photo,
            region: Object.keys(EthiopianRegions).find(
              (key) => EthiopianRegions[key] === res.data.AddressInfo.Region
            ),
            address: `${res.data.AddressInfo.Zone ? res.data.AddressInfo.Zone : ''} ${res.data.AddressInfo.Woreda ? res.data.AddressInfo.Woreda : ''} ${res.data.AddressInfo.Kebele ? res.data.AddressInfo.Kebele : ''}`,
          });
        })
        .catch((error) => {
          setBusinessVerfied(false);
          setErrorMessage(
            error.response?.data?.error || error.response?.data?.message || 'Something Went Wrong!'
          );
        })
        .finally(() => setLoading(false));
    },
  });

  if (businessVerified) return <CreateAccount />;

  return (
    <div className="page-containerr">
      {errorMessage && <InlineNotification type="error" info={errorMessage} />}

      <div className="border border-b-0 rounded-t-xl p-2 px-5 max-w-[var(--form-width)] mx-auto bg-gray-50 mt-6">
        <h3 className="py-2 text-center text-gray-900 text-lg font-semibold">
          Business Information
        </h3>
      </div>

      <form
        className="max-w-[var(--form-width)] border p-8 pt-6 rounded-b-xl mx-auto mb-20"
        onSubmit={formik.handleSubmit}
      >
        <div
          className={`${isTINValid ? 'hidden' : ''} grid gap-6 mb-6 md:grid-cols-3 max-w-[500px] mx-auto items-center`}
        >
          <div className="md:col-span-2">
            <label htmlFor="tin_number" className="block mb-2 text-sm font-medium text-gray-900">
              TIN Number
            </label>
            <input
              type="text"
              id="tin_number"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="tin_number"
              disabled={isLoading}
              autoComplete="off"
              onChange={formik.handleChange}
              value={formik.values.tin_number}
              onKeyDown={(e) => (e.key === 'Enter' ? handleGetLicenseNumber() : undefined)}
            />
            <span className="pl-2 text-sm text-red-600">
              {formik.touched.tin_number && formik.errors.tin_number}
            </span>
          </div>

          <div>
            <button
              type="button"
              disabled={isLoading}
              className="text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 rounded-lg max-w-[180px] px-8 py-2.5 text-center"
              onClick={handleGetLicenseNumber}
            >
              {isLoading ? <LoadingSpinnerButton /> : 'NEXT'}
            </button>
          </div>
        </div>

        <div className={`${isTINValid ? '' : 'hidden'}`}>
          <div className="grid gap-6 mb-6 md:grid-cols-2 max-w-[500px] mx-auto">
            <h3 className="flex items-center gap-2 font-semibold text-gray-700 text-lg ltext-center pl-2 mt-5 md:col-span-2">
              <span className="text-xl">
                <RiProfileFill />
              </span>
              <span>{licenseOwner}</span>
            </h3>
            <div>
              <SelectElement
                title="License Number"
                options={licenseNumbers}
                onSelect={(value) => formik.setFieldValue('license_number', value)}
                defaultValue={formik.values.license_number}
              />
              <span className="pl-2 text-sm text-red-600">
                {formik.touched.license_number && formik.errors.license_number}
              </span>
            </div>

            <div className="relative">
              <span
                className="absolute -top-2 left-0 flex z-10 justify-center items-center h-full w-8 rounded-r text-gray-700 text-lg"
                style={{ pointerEvents: 'none' }}
              >
                <IoMdBusiness />
              </span>

              <SelectElement
                title="Business Type"
                options={businessCategoryList}
                onSelect={(value) => formik.setFieldValue('mcc', value)}
              />
              <span className="pl-2 text-sm text-red-600">
                {formik.touched.mcc && formik.errors.mcc}
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading || !isTINValid}
              className="text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 w-[130px] rounded-lg px-8 py-2.5 text-center"
            >
              {isLoading ? <LoadingSpinnerButton /> : 'NEXT'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateBusinessAccount;
