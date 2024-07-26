import { createContext, useEffect, useState } from 'react';
import RegistrationMethod from './RegistrationMethod';
import yayaBrand from '../../assets/yayawallet-brand.svg';

export const RegistrationContext = createContext(null);

const Index = () => {
  const [store, setStore] = useState({});

  return (
    // @ts-ignore
    <RegistrationContext.Provider value={{ store, setStore }}>
      <div className="page-container">
        {/* <h1 className="text-2xl font-semibold p-2 mb-5">Register Users</h1> */}

        <RegistrationMethod />

        <div className="flex justify-center">
          <img src={yayaBrand} alt="YaYa Wallet" width={'140px'} />
        </div>
      </div>
    </RegistrationContext.Provider>
  );
};

export default Index;
