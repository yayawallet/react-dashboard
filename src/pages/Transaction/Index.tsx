import IndexPage from '../../components/IndexPage';
import { useAuth } from '../../auth/AuthProvider';

const Index = () => {
  const { user_role } = useAuth();

  const links = [
    { path: 'create', name: 'Create Transaction' },
    { path: 'list', name: 'List of Transactions' },
    { path: 'verify-id', name: 'Verify Transaction IDs' },
  ];

  return (
    <IndexPage
      links={links.filter((link) => (user_role === 'clerk' ? link.path !== 'create' : true))}
    />
  );
};

export default Index;
