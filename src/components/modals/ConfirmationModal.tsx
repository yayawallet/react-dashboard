import { useEffect, useRef } from 'react';

interface Props {
  header: string;
  infoList?: (string | number)[];
  openModal: boolean;
  onConfirm: (a: boolean) => void;
}

const ConfirmationModal = ({ header, infoList, openModal, onConfirm }: Props) => {
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
      className="flex bg-black/40 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full"
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

            {infoList && (
              <ul className="list-disc text-gray-900 text-start px-5">
                {infoList.map((list, index) => (
                  <li key={index} className="mb-1">
                    <span className="text-gray-500">{list}</span>
                  </li>
                ))}
              </ul>
            )}

            <button
              ref={buttonRef}
              data-modal-hide="popup-modal"
              type="button"
              className="mt-6 text-white bg-yaya-600 hover:bg-yaya-800 focus:ring-4 focus:outline-none focus:ring-yaya-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
              onClick={() => onConfirm(true)}
            >
              Yes, I'm sure
            </button>
            <button
              type="button"
              className="py-2.5 px-5 ms-3 text-sm font-medium text-yaya-900 focus:outline-none bg-white rounded-lg border border-yaya-200 hover:bg-gray-100 hover:text-yaya-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
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

export default ConfirmationModal;
