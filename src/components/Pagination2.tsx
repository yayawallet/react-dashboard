interface Props {
  page: number;
  pageCount: number;
  isLoading: boolean;
  onPageChange: (newPage: number) => void;
}

const Pagination2 = ({ page, pageCount, isLoading, onPageChange }: Props) => {
  const links = new Array(pageCount >= 5 ? 5 : pageCount);

  console.log(links);

  return (
    <div className="my-4 flxe text-center">
      <ul className="flex">
        <li>
          <div className="flex">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M15 6l-6 6l6 6"></path>
            </svg>
            <span>prev</span>
          </div>
        </li>

        <li>
          <div className="flex">
            <span>next</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M9 6l6 6l-6 6"></path>
            </svg>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Pagination2;
