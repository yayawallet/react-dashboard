import EmptyList from '../../components/ui/EmptyList';

interface Props {
  failed: Object[];
  onHide: () => void;
}

const BulkBillDetailModal = ({ failed, onHide }: Props) => {
  return (
    <div className="table-container">
      <div className="border border-slate-200 rounded-xl">
        <div className="flex flex-wrap justify-between items-center m-3">
          <h3 className="py-2 text-lg font-medium">Failed Records</h3>
          <ul>
            <li className="text-gray-600 font-semibold mr-4">Failed Count: {failed.length}</li>
          </ul>
        </div>

        {failed?.length === 0 ? <EmptyList /> : <div className="overflow-auto"></div>}
      </div>
    </div>
  );
};

export default BulkBillDetailModal;
