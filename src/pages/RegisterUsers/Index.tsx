import { createContext, useState } from 'react';
import RegistrationMethod from './RegistrationMethod';
import yayaBrand from '../../assets/yayawallet-brand.svg';
import { useGetData } from '../../hooks/useSWR';
import BackButton from '../../components/ui/BackButton';
import PageLoading from '../../components/ui/PageLoading';
import YaYaLogoComponent from './YaYaLogoComponent';

export const RegistrationContext = createContext(null);

const Index = () => {
  const [store, setStore] = useState({});
  const { data: profile, isLoading: isProfileLoading } = useGetData('user/profile');

  if (isProfileLoading)
    return (
      <>
        <PageLoading />
        <YaYaLogoComponent />
      </>
    );

  if (!profile?.is_agent)
    return (
      <div className="page-container text-center">
        <h1 className="text-2xl lg:text-4xl pt-[10vh] pb-4">
          Sorry, you don't have permission to access this page.
        </h1>
        <p className="text-lg pb-10">
          {profile?.name}
          <span className="text-gray-600 pl-0.5 pr-2 text-base">@{profile?.account}</span>
          is <strong>not</strong> an <strong>Agent</strong>.
        </p>

        <BackButton gotoPath="/" displayText="Back to Home" />

        <YaYaLogoComponent />
      </div>
    );

  return (
    // @ts-ignore
    <RegistrationContext.Provider value={{ store, setStore }}>
      <div className="page-container">
        <RegistrationMethod />
      </div>
    </RegistrationContext.Provider>
  );
};

export default Index;
