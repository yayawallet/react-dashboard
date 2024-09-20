import { SlArrowLeft } from 'react-icons/sl';
import { useNavigate } from 'react-router-dom';

interface Props {
  gotoPath?: string;
  displayText?: string;
}

const BackButton = ({ gotoPath, displayText }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    gotoPath ? navigate(gotoPath) : navigate(-1);
  };

  return (
    <button
      type="button"
      className="text-white bg-yayaBrand-700 hover:bg-yayaBrand-800 focus:ring-4 focus:outline-none focus:ring-yayaBrand-300 font-medium rounded-lg min-w-[120px] px-5 py-2.5 text-center"
      onClick={handleClick}
    >
      <div
        className="flex items-center justify-center pr-2 gap-x-1"
        style={{ letterSpacing: '0.3px' }}
      >
        <span className="pt-0.5">
          <SlArrowLeft />
        </span>
        <span>{displayText || 'BACK'}</span>
      </div>
    </button>
  );
};

export default BackButton;
