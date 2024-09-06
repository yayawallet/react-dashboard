import { useEffect, useRef } from 'react';

interface Props {
  openModal: boolean;
  onCloseModal: () => void;
  successMessage: string;
}

const ResultModal = ({ openModal, onCloseModal, successMessage }: Props) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (openModal && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [openModal]);

  if (!openModal) return null;

  return (
    <div
      id="popup-modal"
      className="bg-black/60 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-full"
    >
      <div className="relative p-4 w-full max-w-xl max-h-full cursor-auto">
        <div className="relative bg-white rounded-lg shadow">
          <button
            type="button"
            className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
            onClick={() => onCloseModal()}
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

          {successMessage ? (
            <div className="p-4 md:p-5 text-center">
              <div className="mb-5">
                <svg
                  className="mx-auto w-20 h-20"
                  fill="#22C55E"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M12,2 C17.5228475,2 22,6.4771525 22,12 C22,17.5228475 17.5228475,22 12,22 C6.4771525,22 2,17.5228475 2,12 C2,6.4771525 6.4771525,2 12,2 Z M12,4 C7.581722,4 4,7.581722 4,12 C4,16.418278 7.581722,20 12,20 C16.418278,20 20,16.418278 20,12 C20,7.581722 16.418278,4 12,4 Z M15.2928932,8.29289322 L10,13.5857864 L8.70710678,12.2928932 C8.31658249,11.9023689 7.68341751,11.9023689 7.29289322,12.2928932 C6.90236893,12.6834175 6.90236893,13.3165825 7.29289322,13.7071068 L9.29289322,15.7071068 C9.68341751,16.0976311 10.3165825,16.0976311 10.7071068,15.7071068 L16.7071068,9.70710678 C17.0976311,9.31658249 17.0976311,8.68341751 16.7071068,8.29289322 C16.3165825,7.90236893 15.6834175,7.90236893 15.2928932,8.29289322 Z"
                  />
                </svg>
                <span className="text-green-500">Successful</span>
              </div>

              <h3 className="pb-1 text-lg text-gray-800">{successMessage}</h3>
              <hr className="mb-2" />
              <button
                ref={buttonRef}
                data-modal-hide="popup-modal"
                type="button"
                className="mt-6 text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                onClick={() => onCloseModal()}
              >
                Finished
              </button>
            </div>
          ) : (
            <div className="p-4 md:p-5 text-center">
              <div className="mb-5">
                <svg
                  className="mx-auto text-gray-400 w-20 h-20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M7.95206 16.048L16.0769 7.92297" stroke="#EF4444" strokeWidth="2" />
                  <path d="M16.0914 16.0336L7.90884 7.85101" stroke="#EF4444" strokeWidth="2" />
                  <path
                    d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                    stroke="#EF4444"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              <h3 className="mb-3 text-lg font-normal text-gray-800">
                Couldn't process your request!
              </h3>

              <hr className="mb-2" />

              <button
                type="button"
                className="mt-5 text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
                onClick={() => onCloseModal()}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
