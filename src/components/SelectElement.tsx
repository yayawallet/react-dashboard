interface Props {
  title?: string;
  options: object[];
  disabled?: boolean;
  defaultValue?: string;
  onSelect: (value: string) => void;
}

const SelectElement = ({ title, options, disabled, defaultValue, onSelect }: Props) => {
  const code = options?.length > 0 ? Object.keys(options[0])[0] : undefined;
  const value = options?.length > 0 ? Object.keys(options[0])[1] : undefined;

  return (
    <div className="relative">
      <select
        id={title}
        disabled={disabled}
        value={defaultValue}
        className="w-full py-2.5 px-6 pl-8 b-0 rounded focus:ring-1 ring-gray-200 outline-none transition sidebar-scrollbar"
        style={{ color: '#444', background: '#eee', appearance: 'none' }}
        onChange={(e) => onSelect(e.target.value)}
        autoComplete={title}
      >
        <option label={title} className="text-[16px] block font-semibold"></option>
        {options?.length > 0 &&
          code &&
          value &&
          options.map((list, index) => (
            // @ts-ignore
            <option key={index} value={list[code]} className="text-[16px]">
              {// @ts-ignore
              list[value]?.slice(0, 64)}
            </option>
          ))}
      </select>

      <span
        className="custom-select-arrow absolute top-0 right-0 block h-full w-12 rounded-r"
        style={{ background: '#e0e0e0', pointerEvents: 'none' }}
      ></span>
    </div>
  );
};

export default SelectElement;
