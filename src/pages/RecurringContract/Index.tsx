import IndexPage from '../../components/IndexPage';

const Index = () => {
  const links = [
    { path: '/recurring-contract/create', name: 'Create Contract' },
    { path: '/recurring-contract/list', name: 'List of Contracts' },
    { path: '/recurring-contract/report', name: 'Contract Report' },
    { path: '/recurring-contract/request-payment', name: 'Request Payment' },
    { path: '/recurring-contract/request-payment/report', name: 'Request Payment Report' },
  ];

  return <IndexPage links={links} />;
};

export default Index;
