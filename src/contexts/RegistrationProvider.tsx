import { createContext, ReactNode, useState } from 'react';

type RegistrationContextType = {
  accountType: string;
  status: string;
  errorMessage: string;
  successMessage: string;
  updateStatus: (value: string) => void;
  updateErrorMessage: (value: string) => void;
  updateSuccessMessage: (value: string) => void;
};

const defaultRegistrationValue: RegistrationContextType = {
  accountType: '',
  status: '',
  errorMessage: '',
  successMessage: '',
  updateStatus: () => {},
  updateErrorMessage: () => {},
  updateSuccessMessage: () => {},
};

export const RegistrationContext = createContext<RegistrationContextType>(defaultRegistrationValue);

const RegistrationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accountType, setAccountType] = useState('');
  const [status, setStatus] = useState(''); // level-two or business
  const [errorMessage, setErrorMessage] = useState('There is no error');
  const [successMessage, setSuccessMessage] = useState('');

  const updateStatus = (status: string) => setStatus(status);
  const updateErrorMessage = (msg: string) => setErrorMessage(msg);
  const updateSuccessMessage = (msg: string) => setSuccessMessage(msg);

  return (
    <RegistrationContext.Provider
      value={{
        accountType,
        status,
        errorMessage,
        successMessage,
        updateStatus,
        updateErrorMessage,
        updateSuccessMessage,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

export default RegistrationProvider;
