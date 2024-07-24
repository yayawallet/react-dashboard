import { useEffect, useState } from 'react';

interface Props {
  type: 'success' | 'error';
  customType?: string;
  info: string;
}

const InlineNotification = ({ type, customType, info }: Props) => {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    setTimeout(() => setHide(true), 120000); // two minute
  }, []);

  return (
    <div className={`${hide ? 'hidden' : ''}`}>
      <div
        className={`flex justify-between items-center p-4 mb-1 max-w-[800px] mx-auto transition text-[15px] rounded-lg ${type === 'success' ? 'bg-blue-50 text-blue-800' : 'bg-red-50 text-red-800'}`}
        role="alert"
      >
        <div className="flex items-center">
          <svg
            className="flex-shrink-0 inline w-4 h-4 me-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium mr-2">
              {customType ? customType + ' -' : type === 'success' ? 'Success -' : 'Error -'}
            </span>
            {info}
          </div>
        </div>

        <button
          type="button"
          className={`flex ${type === 'success' ? 'text-blue-600 hover:text-blue-900 hover:bg-blue-100' : 'text-red-600 hover:text-red-900 hover:bg-red-100'} rounded-lg text-sm w-8 h-8 mr-2 items-center justify-center`}
          onClick={() => setHide(true)}
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14">
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default InlineNotification;
