import { useState } from 'react';
import yayaBrand from '../../assets/yayawallet-brand.svg';
import RegistrationMethod from './RegistrationMethod';
import Invitation from './Invitation';
import NationalID from './NationalID';

const CreateAccount = () => {
  const [registrationMethod, setRegistrationMethod] = useState('');

  return (
    <div className="page-container">
      <h1 className="text-2xl font-semibold p-2 mb-5">Register Users</h1>

      {!registrationMethod ? (
        <RegistrationMethod onSelectRegistrationMethod={(value) => setRegistrationMethod(value)} />
      ) : registrationMethod === 'invitation' ? (
        <Invitation />
      ) : (
        <NationalID />
      )}

      <div className="flex justify-center">
        <img src={yayaBrand} alt="YaYa Wallet" width={'140px'} />
      </div>
    </div>
  );
};

export default CreateAccount;
