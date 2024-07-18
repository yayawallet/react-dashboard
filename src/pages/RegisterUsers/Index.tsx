import { createContext, useState } from 'react';
import CreateAccount from './CreateAccount';

export const RegistrationContext = createContext(null);

const Index = () => {
  const [store, setStore] = useState({});

  return (
    // @ts-ignore
    <RegistrationContext.Provider value={{ store, setStore }}>
      <CreateAccount />
    </RegistrationContext.Provider>
  );
};

export default Index;
