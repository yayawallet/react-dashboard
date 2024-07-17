import { useContext, useState } from 'react';
import yayaBrand from '../../assets/yayawallet-brand.svg';
import RegistrationMethod from './RegistrationMethod';
import { RegistrationContext } from '../../contexts/RegistrationProvider';
import InlineNotification from '../../components/InlineNotification';

const CreateAccount = () => {
  const [registrationMethod, setRegistrationMethod] = useState('');

  const { errorMessage, successMessage } = useContext(RegistrationContext);

  return (
    <div className="page-container">
      <h1 className="text-2xl font-semibold p-2 mb-5">Register Users</h1>

      {errorMessage && <InlineNotification type="error" info={errorMessage} />}

      {successMessage && (
        <InlineNotification
          type="success"
          customType="Account created successfully"
          info={`account name: ${successMessage}`}
        />
      )}

      <div className="border border-b-0 rounded-t-xl p-2 px-5 max-w-[var(--form-width)] mx-auto bg-gray-50 mt-6">
        <h3 className="py-2 text-center text-gray-900 text-lg font-semibold">
          Create Level-two Account
        </h3>
      </div>

      <RegistrationMethod />

      <div className="flex justify-center">
        <img src={yayaBrand} alt="YaYa Wallet" width={'140px'} />
      </div>
    </div>
  );
};

export default CreateAccount;
