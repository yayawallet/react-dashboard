import { Link } from 'react-router-dom';

interface Props {
  links: { path: string; name: string }[];
}

const IndexPage = ({ links }: Props) => {
  return (
    <div className="page-container">
      <ul className="flex flex-wrap justify-center gap-5 mt-10">
        {links.map((link, index) => (
          <li className="border border-blue-100 text-center p-4 rounded text-blue-800 hover:text-blue-600 hover:bg-slate-50">
            <Link key={index} to={link.path} className="p-6">
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IndexPage;
