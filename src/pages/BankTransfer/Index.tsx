import IndexPage from '../../components/IndexPage';

const Index = () => {
  const links = [
    { path: '/transfer/create', name: 'Bank Transfer' },
    { path: '/transfer/list', name: 'Transfer List' },
    { path: '/transfer/check-fee', name: 'Check Transfer Fee' },
    { path: '/transfer/account-lookup', name: 'External Account Lookup' },
  ];

  return <IndexPage links={links} />;
};

export default Index;
