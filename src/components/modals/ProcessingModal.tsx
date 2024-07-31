import loadingSpin from '../../assets/Spin@1x-1.1s-200px-200px.svg';

interface Props {
  isProcessing: boolean;
}

const ProcessingModal = ({ isProcessing }: Props) => {
  return (
    <div
      id="popup-modal"
      className={`bg-black/60 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full cursor-not-allowed ${isProcessing ? 'flex' : 'hidden'}`}
    >
      <div aria-label="Loading..." role="status" className="flex items-center space-x-2">
        <img src={loadingSpin} width={'160px'} alt="" />
      </div>
    </div>
  );
};

export default ProcessingModal;
