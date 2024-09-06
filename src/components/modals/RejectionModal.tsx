import { useEffect, useState, useRef } from 'react';

interface Props {
  header: string;
  infoList?: (string | number)[];
  openModal: boolean;
  onConfirm: (a: boolean | string) => void;
}

const RejectionModal = ({ header, openModal, onConfirm }: Props) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const modalRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (openModal && modalRef.current) {
      modalRef.current.focus();
    }
  }, [openModal]);

  if (!openModal) return null;

  return (
    <div
      id="popup-modal"
      className="flex bg-black/60 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full"
    >
      <div className="relative p-4 w-full max-w-xl max-h-full cursor-auto">
        <div className="relative bg-white rounded-lg shadow">
          <button
            type="button"
            className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            onClick={() => onConfirm(false)}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>

          <div className="p-4 md:p-5 text-center">
            <svg
              className="mx-auto mb-4 text-gray-400 w-12 h-12"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>

            <h3 className="mb-2 text-lg font-normal text-gray-500">{header}</h3>

            <hr className="mb-5" />

            <textarea
              autoFocus
              maxLength={256}
              className="w-full min-h-20 resize-y p-2 border-2 rounded text-gray-600"
              onChange={(e) => setRejectionReason(e.currentTarget.value)}
              placeholder="Your rejection reason"
            ></textarea>

            <button
              data-modal-hide="popup-modal"
              type="button"
              className="mt-6 text-white bg-violet-600 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
              onClick={() => onConfirm(rejectionReason)}
            >
              Reject Payment
            </button>
            <button
              type="button"
              className="py-2.5 px-5 ms-3 text-sm font-medium text-violet-900 focus:outline-none bg-white rounded-lg border border-violet-200 hover:bg-gray-100 hover:text-violet-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
              onClick={() => onConfirm(false)}
            >
              No, cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectionModal;
