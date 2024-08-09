import { CgProfile } from 'react-icons/cg';

const InputUserIconPlaceholder = () => {
  return (
    <span
      className="absolute top-0 left-0 flex justify-center items-centerr h-full w-8 rounded-r text-gray-500"
      style={{ top: '14px', pointerEvents: 'none' }}
    >
      <CgProfile />
    </span>
  );
};

export default InputUserIconPlaceholder;
