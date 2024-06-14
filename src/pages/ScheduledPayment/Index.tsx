import IndexPage from '../../components/IndexPage';

const Index = () => {
  const links = [
    { path: '/scheduled-payment/create', name: 'Create Scheduled Payment' },
    { path: '/scheduled-payment/list', name: 'List of Scheduled Payments' },
    { path: '/scheduled-payment/report', name: 'Scheduled Payment Report' },
  ];

  return <IndexPage links={links} />;
};

export default Index;
