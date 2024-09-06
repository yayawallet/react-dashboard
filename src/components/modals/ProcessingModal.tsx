import loadingSpin from '../../assets/Rolling@1x-1.0s-200px-200px.svg';

interface Props {
  isProcessing: boolean;
}

const ProcessingModal = ({ isProcessing }: Props) => {
  if (!isProcessing) return null;

  return (
    <div
      id="popup-modal"
      className="bg-black/40 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full cursor-wait"
    >
      <div aria-label="Loading..." role="status" className="flex items-center space-x-2">
        <img src={loadingSpin} width={'56px'} alt="" />
      </div>
    </div>
  );
};

export default ProcessingModal;
