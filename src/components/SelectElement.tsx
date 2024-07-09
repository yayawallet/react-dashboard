interface Props {
  title?: string;
  options: string[];
  onSelect: (value: string) => void;
}

const SelectElement = ({ title, options, onSelect }: Props) => {
  return (
    <div className="relative">
      <select
        id={title}
        className="w-full py-2.5 px-6 b-0 rounded focus:ring-4j ring-gray-200 outline-none transition sidebar-scrollbar"
        style={{ color: '#444', background: '#eee', appearance: 'none' }}
        onChange={(e) => onSelect(e.target.value)}
        autoComplete={title}
      >
        <option label={title} className="text-[16px] font-semibold"></option>
        {options?.map((list, index) => (
          <option key={index} value={list} className="text-[16px]">
            {list}
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
