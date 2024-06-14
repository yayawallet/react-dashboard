import IndexPage from '../../components/IndexPage';

const Index = () => {
  const links = [
    { path: 'transaction/create', name: 'Create Transaction' },
    { path: 'transaction/list', name: 'List of Transactions' },
    { path: 'transaction/verify-id', name: 'Verify Transaction IDs' },
  ];

  return <IndexPage links={links} />;
};

export default Index;
