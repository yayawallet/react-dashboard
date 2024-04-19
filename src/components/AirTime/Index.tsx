const CreateTransaction = () => {
  return (
    <div className="container">
      <h1 className="text-2xl font-semibold p-2 mb-5">Top-up Air Time</h1>

      <div className="flex gap-x-4 my-5 ml-10">
        <button className="text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
          Buy Air Time
        </button>

        <button className="text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
          Buy Package
        </button>
      </div>

      <div className=""></div>
    </div>
  );
};

export default CreateTransaction;
