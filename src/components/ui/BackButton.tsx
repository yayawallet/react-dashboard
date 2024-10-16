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
      className="text-white bg-yaya-700 hover:bg-yaya-800 focus:ring-4 focus:outline-none focus:ring-yaya-300 rounded-lg min-w-[100px] px-3 py-1.5 text-center"
      onClick={handleClick}
    >
      <div
        className="flex items-center justify-center pr-2 gap-x-1 text-sm lg:text-base"
        style={{ letterSpacing: '0.3px' }}
      >
        <span className="pt-0.5 text-sm">
          <SlArrowLeft />
        </span>
        <span>{displayText || 'BACK'}</span>
      </div>
    </button>
  );
};

export default BackButton;
