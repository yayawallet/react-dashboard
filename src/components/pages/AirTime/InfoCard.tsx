const InfoCard = () => {
  return (
    <div>
      <div className="relative p-4 w-full max-w-xl max-h-full cursor-auto">
        <div className="relative bg-white rounded-lg shadow">
          <button
            type="button"
            className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
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
            <div className="mb-5">
              <svg
                className="mx-auto text-gray-400 w-12 h-12"
                fill="#9ca3af"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M12,2 C17.5228475,2 22,6.4771525 22,12 C22,17.5228475 17.5228475,22 12,22 C6.4771525,22 2,17.5228475 2,12 C2,6.4771525 6.4771525,2 12,2 Z M12,4 C7.581722,4 4,7.581722 4,12 C4,16.418278 7.581722,20 12,20 C16.418278,20 20,16.418278 20,12 C20,7.581722 16.418278,4 12,4 Z M15.2928932,8.29289322 L10,13.5857864 L8.70710678,12.2928932 C8.31658249,11.9023689 7.68341751,11.9023689 7.29289322,12.2928932 C6.90236893,12.6834175 6.90236893,13.3165825 7.29289322,13.7071068 L9.29289322,15.7071068 C9.68341751,16.0976311 10.3165825,16.0976311 10.7071068,15.7071068 L16.7071068,9.70710678 C17.0976311,9.31658249 17.0976311,8.68341751 16.7071068,8.29289322 C16.3165825,7.90236893 15.6834175,7.90236893 15.2928932,8.29289322 Z"
                />
              </svg>
              <span className="text-gray-500">Successful</span>
            </div>

            <h3 className="mb-2 text-lg font-normal text-gray-800">
              <span className="text-xl">-1.00</span>
              <span className="text-sm"> (ETB)</span>
            </h3>
            <hr className="mb-5" />
            <ul className="text-start px-5">
              <li>
                <span className="text-gray-600">Service Number: </span>{' '}
                +251967532329
              </li>
              <li>
                <span className="text-gray-600">Transaction Id: </span>{' '}
                aaslidf80a9s8df-as0d98a-sd0f98-0adfs98-sdf9
              </li>
            </ul>
            <button
              data-modal-hide="popup-modal"
              type="button"
              className="mt-5 text-white bg-violet-600 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
            >
              Finished
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
