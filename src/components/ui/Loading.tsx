const Loading = () => {
  return (
    <div className="flex flex-col bg-slate-100 items-center justify-center mt-20 p-5 border border-slate-200 rounded">
      <h1 className="text-4xl font-semibold flex items-center gap-x-2">
        <span
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        ></span>
        <span className="inline-block mb-1.5">Loading...</span>
      </h1>
    </div>
  );
};

export default Loading;
