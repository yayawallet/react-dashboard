import faydaLogo from '../../assets/fayda-logo.png';

const RegistrationMethod = () => {
  return (
    <div className="flex flex-col gap-y-10 justify-center gap-x-20 max-w-[var(--form-width)] border p-8 rounded-b-xl mx-auto mb-20">
      <div className="flex flex-col gap-y-4 items-center">
        <button className="h-12 text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-full w-full sm:w-[280px] px-5 py-2.5 text-centerm">
          Invitation
        </button>

        <button className="p-0 text-white bg-violet-700 hover:bg-violet-800 focus:ring-4 focus:outline-none focus:ring-violet-300 font-medium rounded-full w-full sm:w-[280px] text-center">
          <img src={faydaLogo} className="inline-block h-12" alt="National ID" />
        </button>
      </div>
    </div>
  );
};

export default RegistrationMethod;
