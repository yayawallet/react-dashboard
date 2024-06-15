import IndexPage from '../../components/IndexPage';
import { useAuth } from '../../auth/AuthProvider';

const Index = () => {
  const { user_role } = useAuth();

  const links = [
    { path: 'create', name: 'Bank Transfer' },
    { path: 'list', name: 'Transfer List' },
    { path: 'check-fee', name: 'Check Transfer Fee' },
    { path: 'account-lookup', name: 'External Account Lookup' },
  ];
  return (
    <IndexPage
      links={links.filter((link) => (user_role === 'clerk' ? link.path !== 'create' : true))}
    />
  );
};

export default Index;
