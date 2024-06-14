import { Link } from 'react-router-dom';

interface Props {
  links: [{ path: string; name: string }];
}

const IndexPage = ({ links }: Props) => {
  return (
    <div className="page-container">
      {links.map((link) => (
        <Link to={link.path} className="p-6">
          {link.name}
        </Link>
      ))}
    </div>
  );
};

export default IndexPage;
