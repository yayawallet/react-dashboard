import { createContext, ReactNode, useState } from 'react';

type RegistrationContextType = {
  status: string;
  errorMessage: string;
  successMessage: string;
  updateStatus: (value: string) => void;
  updateErrorMessage: (value: string) => void;
  updateSuccessMessage: (value: string) => void;
};

const defaultRegistrationValue: RegistrationContextType = {
  status: '',
  errorMessage: '',
  successMessage: '',
  updateStatus: () => {},
  updateErrorMessage: () => {},
  updateSuccessMessage: () => {},
};

export const RegistrationContext = createContext<RegistrationContextType>(defaultRegistrationValue);

const RegistrationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState(''); // level-two or business
  const [errorMessage, setErrorMessage] = useState('There is no error');
  const [successMessage, setSuccessMessage] = useState('');

  const updateStatus = (status: string) => setStatus(status);
  const updateErrorMessage = (msg: string) => setErrorMessage(msg);
  const updateSuccessMessage = (msg: string) => setSuccessMessage(msg);

  return (
    <RegistrationContext.Provider
      value={{
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
