import IndexPage from '../../components/IndexPage';
import { useAuth } from '../../auth/AuthProvider';

const Index = () => {
  const { user_role } = useAuth();

  const links = [
    { path: 'create', name: 'Create Contract' },
    { path: 'list', name: 'List of Contracts' },
    { path: 'report', name: 'Contract Report' },
    { path: 'request-payment', name: 'Request Payment' },
    { path: 'request-payment/report', name: 'Request Payment Report' },
  ];

  return (
    <IndexPage
      links={links
        .filter((link) => (user_role === 'clerk' ? link.path !== 'create' : true))
        .filter((link) => (user_role === 'clerk' ? link.path !== 'request-payment' : true))}
    />
  );
};

export default Index;
