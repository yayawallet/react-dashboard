interface Props {
  totalSteps: number;
  currentStep: number;
}

const Stepper = ({ totalSteps, currentStep }: Props) => {
  const steps = Array.from({ length: totalSteps - 1 }, (_, i) => i + 1);
  return (
    <ol className="flex items-center w-full font-medium text-center text-gray-500 text-base">
      {steps.map((i) => (
        <li
          key={i}
          className="flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6"
        >
          <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200">
            <span
              className={`me-2 ${i <= currentStep ? 'bg-yaya-600 text-white rounded-full w-6 h-6 flex justify-center items-baseline' : ''}`}
            >
              {i}
            </span>
          </span>
        </li>
      ))}

      <li className="flex items-center">
        <span
          className={`me-2 ${totalSteps <= currentStep ? 'bg-yaya-600 text-white rounded-full w-6 h-6 flex justify-center items-baseline' : ''}`}
        >
          {totalSteps}
        </span>
      </li>
    </ol>
  );
};

export default Stepper;
