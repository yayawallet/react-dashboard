import { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';
import ConfirmationModal from '../../common/Modals/ConfirmationModal';
import ProcessingModal from '../../common/Modals/ProcessingModal';
import ResultModal from '../../common/Modals/ResultModal';
import { TopUp, Package } from './../../../models';

const packageCategories = [
  'One-Birr Package',
  'Good Morning',
  'Birthday Package',
  'Hourly & Daily Unlimited Package',
  'Internet',
  'Voice',
  'Voice Plus Internet',
  'Flexi,International Pack- Destination 1',
  'International Pack- Destination 2',
  'SMS Package',
  'Voice Flexi Local All Net Package',
];

interface Props {
  phoneNumber: string;
  isInvalidNumber: boolean;
}

const BuyPackage = ({ phoneNumber, isInvalidNumber }: Props) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [categories, setCategories] = useState(packageCategories);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [selectedPackageAmount, setSelectedPackageAmount] = useState(0);
  const [selectedPackageName, setSelectedPackageName] = useState('');
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSucceed, setIsSucceed] = useState(false);
  const [topup, setTopup] = useState<TopUp>();
  const [openInfoCard, setOpenInfoCard] = useState(false);

  useEffect(() => {
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/airtime/packages`, {
        phone: '+2519', // Ethio telecom packages
      })
      .then((res) => setPackages(res.data));
  }, []);

  useEffect(() => {
    if (packages.length === 0) return;

    const catgSet = new Set(packages.map((p) => p.category));
    setCategories(Array.from(catgSet));
  }, [packages]);

  const handleConfirm = (confirm: boolean) => {
    setOpenConfirmModal(false);
    if (!confirm) return;

    setIsProcessing(true);
    axios
      .post(`${import.meta.env.VITE_BASE_URL}/package/buy`, {
        phone: '+251' + phoneNumber,
        package: selectedPackage,
      })
      .then((res) => {
        setIsProcessing(false);
        setTopup(res.data);
        console.log('hiiii');
        console.log(res.data);
        setOpenInfoCard(true);
        setIsSucceed(true);
      })
      .catch(() => {
        setIsProcessing(false);
        setTopup(undefined);
        setOpenInfoCard(true);
        setIsSucceed(false);
      });
  };

  const handleCloseInfoCard = () => {
    setOpenInfoCard(false);
  };

  return (
    <div>
      <ConfirmationModal
        openModal={openConfirmModal}
        onConfirm={handleConfirm}
        header={`Are you sure you want to pay ${selectedPackageAmount} Birr?`}
        infoList={[selectedPackageName, `Service Number: ${phoneNumber}`]}
      />
      <ProcessingModal isProcessing={isProcessing} />
      <ResultModal
        openModal={openInfoCard}
        onCloseModal={handleCloseInfoCard}
        successMessage={
          isSucceed ? `You've paid ${topup?.amount.toFixed(2)} ETB for ${topup?.phone}` : ''
        }
      />

      <div className="flex gap-6 border-2 rounded-lg p-5">
        <div className="flex flex-col gap-y-3">
          {categories.map((c) => (
            <div
              className={`border border-violet-200 rounded-lg text-violet-900 font-semibold md:w-40 p-2 py-4 flex justify-center text-center hover:bg-violet-50 cursor-pointer ${selectedCategory == c ? 'bg-violet-600 text-white border-violet-600 hover:bg-violet-700' : ''}`}
              key={c}
              onClick={() => setSelectedCategory(c)}
            >
              <span>{c}</span>
            </div>
          ))}
        </div>

        {packages.length > 0 ? (
          <div className="h-full w-full sticky top-3">
            <div className="flex flex-wrap gap-x-2 gap-y-4">
              {packages
                .filter((pkg) => (!selectedCategory ? pkg : pkg.category == selectedCategory))
                .map((pkg) => (
                  <div
                    key={pkg.code}
                    className={`border border-violet-200 text-gray-900 hover:bg-violet-50 rounded-lg w-max-[19rem] lg:w-[19.5rem] px-3 py-2 flex flex-col justify-between cursor-pointer ${selectedPackage === pkg.code ? 'ring-4 ring-violet-300' : ''}`}
                    onClick={() => {
                      setSelectedPackage(pkg.code);
                      setSelectedPackageAmount(pkg.amount);
                      setSelectedPackageName(pkg.name);
                    }}
                  >
                    <span>{pkg.name.replace(/:\s\d+\sBirr$/, '')}</span> <br />
                    <span className="inline-block pt-2i text-lg text-violet-900 font-bold">
                      {pkg.amount} ETB
                    </span>
                  </div>
                ))}
            </div>
            <button
              className="block mx-auto mt-10 text-white gap-x-2 bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg w-full sm:max-w-56 px-5 py-2 text-center cursor-pointer"
              disabled={!selectedPackage || isInvalidNumber}
              onClick={() => setOpenConfirmModal(true)}
            >
              Next
            </button>
          </div>
        ) : (
          <div className="h-full w-full flex justify-center mt-20">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyPackage;
