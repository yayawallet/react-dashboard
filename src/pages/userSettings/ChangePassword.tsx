import { SlArrowLeft } from 'react-icons/sl';

const ChangePassword = () => {
  return (
    <div>
      <div className="flex items-center gap-x-1 text-gray-600">
        <span className="text-sm">
          <SlArrowLeft />
        </span>
        <button className="">Back</button>
      </div>
    </div>
  );
};

export default ChangePassword;
