import { createContext, ReactNode, useContext, useState } from 'react';

type RegistrationContextType = {
  store: Object;
  setStore: (value: Object) => void;
};

// const defaultRegistrationValue: RegistrationContextType = {
//   store: {},
//   setStore: () => null,
// };

export const RegistrationContext = createContext<RegistrationContextType | null>(null);

export const useRegistration = useContext(RegistrationContext);

const RegistrationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [store, setStore] = useState({});

  return (
    <RegistrationContext.Provider
      value={{
        store,
        setStore,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

export default RegistrationProvider;
