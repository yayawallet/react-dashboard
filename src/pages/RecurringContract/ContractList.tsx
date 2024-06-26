import { useEffect, useState } from 'react';
import { authAxios } from '../../api/axios';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import ProcessingModal from '../../components/modals/ProcessingModal';
import ResultModal from '../../components/modals/ResultModal';
import NotFound from '../../components/NotFound';
import SearchBar from '../../components/SearchBar';
import { recurringContract } from '../../models';
import useAccessToken from '../../hooks/useAccessToken';
import PageLoading from '../../components/ui/PageLoading';

const ContractList = () => {
  const [contractList, setContractList] = useState<recurringContract[]>([]);
  const [copiedID, setCopiedID] = useState('');
  const [selectedContract, setSelectedContract] = useState<recurringContract>();
  const [openInfoCard, setOpenInfoCard] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [filterByStatus, setFilterByStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredContractList, setFilteredContractList] = useState<recurringContract[]>([]);

  const { accessToken } = useAccessToken();

  useEffect(() => {
    authAxios
      .get('/recurring-contract/list')
      .then((res) => {
        setContractList(res.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [accessToken]);

  useEffect(() => {
    if (searchQuery) {
      handleSearchContractList(searchQuery);

      return;
    }

    setFilteredContractList(
      contractList.filter((item) => (filterByStatus ? item.status === filterByStatus : true))
    );
  }, [contractList, filterByStatus, accessToken]);

  const handleOnConfirm = (confirm: boolean) => {
    setOpenModal(false);
    if (!confirm) return;

    setIsProcessing(true);
    setSuccessMessage('');
    authAxios
      .get(`/recurring-contract/deactivate/${selectedContract?.id}`)
      .then(() => {
        setSuccessMessage('Contract Deactivated Successfully');
        setContractList((prev) => prev.filter((l) => l.id != selectedContract?.id));
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
        (item) =>
          (searchPatt.test(item.contract_number) ||
            searchPatt.test(item.service_type) ||
            searchPatt.test(item.customer.account) ||
            searchPatt.test(item.customer.name)) &&
          (filterByStatus ? item.status === filterByStatus : true)
      )
    );
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

      <div className="mt-5">
        {contractList.length === 0 ? (
          isLoading ? (
            <PageLoading />
          ) : (
            <NotFound />
          )
        ) : (
          <>
            <div className="flex items-baseline mb-2 mx-5 gap-x-8">
              <div className="w-80">
                <SearchBar
                  onSearch={handleSearchContractList}
                  placeholder="Contract, Service Type, Customer, ..."
                />
              </div>
              <div className="">
                Filter by:
                <span
                  className={`inline-flex items-center bg-gray-100 text-gray-500 px-4 py-1 rounded mx-2 cursor-pointer ${filterByStatus === 'approved' ? 'bg-violet-600 text-white' : ''}`}
                  onClick={() =>
                    setFilterByStatus((prev) => (prev === 'approved' ? '' : 'approved'))
                  }
                >
                  Aproved
                </span>
                <span
                  className={`inline-flex items-center bg-gray-100 text-gray-500 px-4 py-1 rounded mx-2 cursor-pointer ${filterByStatus === 'pending' ? 'bg-violet-600 text-white' : ''}`}
                  onClick={() => setFilterByStatus((prev) => (prev === 'pending' ? '' : 'pending'))}
                >
                  Pending
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-violet-500 text-gray-50">
                    <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                      ID
                    </th>
                    <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                      Customer Name
                    </th>
                    <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                      Contract Number
                    </th>
                    <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                      Service Type
                    </th>
                    <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                      Status
                    </th>
                    <th className="border-t border-b border-slate-100 text-left p-3 font-medium">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredContractList?.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-100 text-nowrap">
                      <td
                        title={item.id}
                        className="relative border-t border-b border-slate-200 p-3"
                        onClick={() => copySchedulePaymentId(item.id)}
                      >
                        {`${item.id.slice(0, 4)}...${item.id.slice(-2)}`}
                        <span
                          className={`${copiedID === item.id ? '' : 'hidden'} absolute -top-2 left-4 text-center text-white bg-black opacity-70 text-sm px-3 py-1 rounded-lg`}
                        >
                          Id copied
                        </span>
                      </td>

                      <td className="border-t border-b border-slate-200 p-3">
                        {item.customer.name.split(' ').slice(0, 2).join(' ')}
                        <br />
                        <span className="text-gray-500 text-xs block" style={{ marginTop: '-3px' }}>
                          {'@' + item.customer.account}
                        </span>
                      </td>

                      <td className="border-t border-b border-slate-200 p-3">
                        {item.contract_number}
                      </td>
                      <td className="border-t border-b border-slate-200 p-3">
                        {item.service_type}
                      </td>
                      <td className="border-t border-b border-slate-200 p-3">{item.status}</td>
                      <td className="border-t border-b border-slate-200 p-3">
                        <button
                          className="text-sm bg-red-600 text-white py-1 px-3 rounded"
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
          </>
        )}
      </div>
    </div>
  );
};

export default ContractList;
