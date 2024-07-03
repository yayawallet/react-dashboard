import { usePostData } from '../hooks/useSWR';
import { Institution } from '../models';

interface Props {
  onSelect: (value: string) => void;
}

const InstitutionLIst = ({ onSelect }: Props) => {
  const { data: institutionList } = usePostData('/financial-institution/list', {
    country: 'Ethiopia',
  });

  return (
    <div className="relative">
      <select
        id="institution"
        className="w-full py-2.5 px-6 b-0 rounded focus:ring-4j ring-gray-200 outline-none transition sidebar-scrollbar"
        style={{ color: '#444', background: '#eee', appearance: 'none' }}
        onChange={(e) => onSelect(e.target.value)}
      >
        <option label="Choose Institution" className="text-[16px] font-semibold"></option>
        {institutionList?.map((list: Institution) => (
          <option key={list.code} value={list.code} className="text-[16px]">
            {list.name}
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

export default InstitutionLIst;
