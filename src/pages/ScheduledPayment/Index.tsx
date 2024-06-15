import IndexPage from '../../components/IndexPage';
import { useAuth } from '../../auth/AuthProvider';

const Index = () => {
  const { user_role } = useAuth();

  const links = [
    { path: 'create', name: 'Create Scheduled Payment' },
    { path: 'list', name: 'List of Scheduled Payments' },
    { path: 'report', name: 'Scheduled Payment Report' },
  ];

  return (
    <IndexPage
      links={links.filter((link) => (user_role === 'clerk' ? link.path !== 'create' : true))}
    />
  );
};

export default Index;
