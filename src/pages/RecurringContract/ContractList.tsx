import { useEffect, useState } from 'react';
import { authAxios } from '../../api/axios';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import ProcessingModal from '../../components/modals/ProcessingModal';
import ResultModal from '../../components/modals/ResultModal';
import SearchBar from '../../components/SearchBar';
import { recurringContract } from '../../models';
import { capitalize } from '../../utils/table_utils';
import { useGetData } from '../../hooks/useSWR';
import Loading from '../../components/ui/Loading';
import Error from '../../components/ui/Error';
import EmptyList from '../../components/ui/EmptyList';
import { GoDotFill } from 'react-icons/go';
import RefreshButton from '../../components/ui/RefreshButton';

const ContractList = () => {
  const [copiedID, setCopiedID] = useState('');
  const [selectedContract, setSelectedContract] = useState<recurringContract>();
  const [openInfoCard, setOpenInfoCard] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [filterByStatus, setFilterByStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContractList, setFilteredContractList] = useState<recurringContract[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { error, isLoading, data: contractList, mutate } = useGetData('/recurring-contract/list');

  useEffect(() => {
    if (searchQuery) {
      handleSearchContractList(searchQuery);

      return;
    }

    setFilteredContractList(
      contractList?.filter((item: recurringContract) =>
        filterByStatus ? item.status === filterByStatus : true
      )
    );
  }, [contractList, filterByStatus]);

  const handleOnConfirm = (confirm: boolean) => {
    setOpenModal(false);
    if (!confirm) return;

    setIsProcessing(true);
    setSuccessMessage('');
    authAxios
      .get(`/recurring-contract/deactivate/${selectedContract?.id}`)
      .then(() => {
        setSuccessMessage('Contract Deactivated Successfully');
        mutate();
        setIsProcessing(false);
        setOpenInfoCard(true);
      })
      .catch(() => {
        setIsProcessing(false);
        setOpenInfoCard(true);
      });
  };

  const handleCloseInfoCard = () => setOpenInfoCard(false);

  const copySchedulePaymentId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedID(id);

    setTimeout(() => setCopiedID(''), 1000);
  };

  const handleSearchContractList = (query: string) => {
    setSearchQuery(query);
    const searchPatt = new RegExp(query, 'i');

    setFilteredContractList(
      contractList.filter(
        (item: recurringContract) =>
          (searchPatt.test(item.contract_number) ||
            searchPatt.test(item.service_type) ||
            searchPatt.test(item.customer.account) ||
            searchPatt.test(item.customer.name)) &&
          (filterByStatus ? item.status === filterByStatus : true)
      )
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await mutate();
    setIsRefreshing(false);
  };

  return (
    <div className="table-container">
      <ConfirmationModal
        header="Are you sure you want to Deactivate this contract?"
        infoList={[
          `Contract Number: ${selectedContract?.contract_number}`,
          `Service Type: ${selectedContract?.service_type}`,
          `Customer Name: ${selectedContract?.customer.name}`,
        ]}
        openModal={openModal}
        onConfirm={handleOnConfirm}
      />
      <ProcessingModal isProcessing={isProcessing} />
      <ResultModal
        openModal={openInfoCard}
        onCloseModal={handleCloseInfoCard}
        successMessage={successMessage}
      />

      <div className="">
        {error ? (
          <Error />
        ) : isLoading ? (
          <Loading />
        ) : (
          <div className="border border-slate-200 rounded-xl">
            <div className="flex gap-4 flex-wrap justify-between items-center m-4">
              <div className="">
                Filter by:
                <span
                  className={`inline-flex items-center border bg-gray-100 text-gray-500 px-4 pb-1.5 pt-1 rounded mx-2 cursor-pointer ${filterByStatus === 'approved' ? 'bg-yaya-600 text-white' : ''}`}
                  onClick={() =>
                    setFilterByStatus((prev) => (prev === 'approved' ? '' : 'approved'))
                  }
                >
                  Approved
                </span>
                <span
                  className={`inline-flex items-center border bg-gray-100 text-gray-500 px-4 pb-1.5 pt-1 rounded mx-2 cursor-pointer ${filterByStatus === 'pending' ? 'bg-yaya-600 text-white' : ''}`}
                  onClick={() => setFilterByStatus((prev) => (prev === 'pending' ? '' : 'pending'))}
                >
                  Pending
                </span>
              </div>

              <div className="w-64">
                <SearchBar
                  onSearch={handleSearchContractList}
                  placeholder="ID, Service Type, Customer Name, ..."
                />
              </div>

              <div onClick={handleRefresh}>
                <RefreshButton />
              </div>
            </div>
            {filteredContractList?.length === 0 ? (
              <EmptyList />
            ) : (
              <div className="relative">
                <div className={`${isRefreshing ? '' : 'hidden'}`}>
                  <div
                    className="absolute z-10 bg-white rounded-full p-1.5"
                    style={{
                      top: '30vh',
                      left: '50%',
                      transform: 'translate(-50%)',
                      boxShadow: '0 0 5px #888',
                    }}
                  >
                    <span
                      className="inline-block border-gray-400 h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                      role="status"
                    ></span>
                  </div>
                  <div className="absolute z-20 h-full w-full"></div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left px-4 py-3 font-medium">ID</th>
                        <th className="text-left px-4 py-3 font-medium">Customer Name</th>
                        <th className="text-left px-4 py-3 font-medium">Customer Account</th>
                        <th className="text-left px-4 py-3 font-medium">Contract Number</th>
                        <th className="text-left px-4 py-3 font-medium">Status</th>
                        <th className="text-left px-4 py-3 font-medium">Service Type</th>
                        <th className="text-left px-4 py-3 font-medium">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredContractList?.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-100 text-nowrap">
                          <td
                            title={item.id}
                            className="relative border-b border-slate-200 p-3 cursor-pointer"
                            onClick={() => copySchedulePaymentId(item.id)}
                          >
                            {`${item.id.slice(0, 6)}...${item.id.slice(-2)}`}
                            <span
                              className={`${copiedID === item.id ? '' : 'hidden'} absolute -top-2 left-4 z-10 w-30 text-center text-white bg-black opacity-70 text-sm px-3 py-1 rounded-lg`}
                            >
                              ID Copied
                            </span>
                          </td>

                          <td className="border-b border-slate-200 p-3">
                            {capitalize(item.customer.name).split(' ').slice(0, 2).join(' ')}
                          </td>
                          <td className="border-b border-slate-200 p-3">
                            <span className="text-gray-500">@{item.customer.account}</span>
                          </td>

                          <td className="border-b border-slate-200 p-3">{item.contract_number}</td>
                          <td className="border-b border-slate-200 p-3">
                            <span
                              className={`inline-block align-middle pb-0.5 pr-1 text-[16px] ${item.status === 'pending' ? 'text-orange-500' : item.status === 'approved' ? 'text-green-500' : 'text-gray-500'}`}
                            >
                              <GoDotFill />
                            </span>
                            {capitalize(item.status)}
                          </td>
                          <td className="border-b border-slate-200 p-3">{item.service_type}</td>
                          <td className="border-b border-slate-200 p-3">
                            <button
                              className="bg-red-600 text-white pt-1 pb-1.5 px-3 rounded hover:bg-red-700"
                              onClick={() => {
                                setSelectedContract(item);
                                setOpenModal(true);
                              }}
                            >
                              Deactivate
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractList;
