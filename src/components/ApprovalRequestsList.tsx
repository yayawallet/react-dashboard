import { useState } from 'react';
import Pagination from './Pagination';
import { ApprovalRequesType } from '../models';
import { useGetData, usePostData } from '../hooks/useSWR';
import Loading from './ui/Loading';
import Error from './ui/Error';
import EmptyList from './ui/EmptyList';
import { formatDate } from '../utils/table_utils';
import RefreshButton from './ui/RefreshButton';
import RefreshComponent from './ui/RefreshComponent';
import ConfirmationModal from './modals/ConfirmationModal';
import ProcessingModal from './modals/ProcessingModal';
import RejectionModal from './modals/RejectionModal';
import { authAxios } from '../api/axios';
import { capitalize } from '../utils/table_utils';
import { GoDotFill } from 'react-icons/go';
import { useAuth } from '../auth/AuthProvider';
import React from 'react';
import { BsDownload } from 'react-icons/bs';
import { SmallLoading } from './ui/DotLoader';
import InlineNotification from './InlineNotification';

interface Props {
  requestType: 'transaction' | 'bank-transfer' | 'scheduled-payment' | 'bulk' | 'airtime';
  requestsListEndpoint: string;
  submittingEndpoints: string;
}

const ApprovalRequestsList = ({
  requestType,
  requestsListEndpoint,
  submittingEndpoints,
}: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedID, setCopiedID] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [openRejectionModal, setOpenRejectionModal] = useState(false);
  const [showDetailID, setShowDetailID] = useState<string | null>(null);
  const [selectedActionUUID, setSelectedActionUUID] = useState('');
  const [approvalError, setApprovalError] = useState('');
  const [filterPending, setFilterPending] = useState(false);

  const { user } = useAuth();
  const user_id = user?.user_id || null;
  const user_role = user?.user_role || null;

  const { data: packages, isLoading: isPackagesLoading } = usePostData('airtime/packages', {
    phone: '+2519',
  });
  const { data: institutionList, isLoading: isInstitutionListLoading } = usePostData(
    'financial-institution/list',
    {
      country: 'Ethiopia',
    }
  );

  const {
    error,
    isLoading,
    isValidating,
    mutate,
    data: {
      data: approvalRequestList,
      lastPage: pageCount,
      total: totalApprovalRequests,
      perPage,
    } = {},
  } = useGetData(`${requestsListEndpoint}?page=${currentPage}`);

  const copyTransactionID = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedID(id);

    setTimeout(() => setCopiedID(''), 1000);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await mutate();
    setIsRefreshing(false);
  };

  const handleFilterPending = () => {
    setFilterPending((prev) => !prev);
    mutate();
  };

  const handleOnApproveClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    uuid: string
  ) => {
    e.stopPropagation();

    setSelectedActionUUID(uuid || '');
    setOpenConfirmationModal(true);
  };

  const handleOnRejectClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    uuid: string
  ) => {
    e.stopPropagation();

    setSelectedActionUUID(uuid || '');
    setOpenRejectionModal(true);
  };

  const handleApproveApprovalRequest = (confirm: boolean) => {
    setOpenConfirmationModal(false);
    if (!confirm) return;

    setIsProcessing(true);
    setApprovalError('');

    const formData = new FormData();
    formData.append('response', 'Approve');
    formData.append('approval_request_id', selectedActionUUID);

    authAxios
      .post(submittingEndpoints, formData)
      .then(() => {
        setIsProcessing(false);
        mutate();
      })
      .catch(() => {
        setApprovalError('Something went wrong');
      })
      .finally(() => {
        setIsProcessing(false);
        setSelectedActionUUID('');
      });
  };

  const handleRejectApprovalRequest = (confirm: boolean | string) => {
    setOpenRejectionModal(false);
    if (!confirm) return;

    setIsProcessing(true);
    setApprovalError('');

    const formData = new FormData();
    formData.append('response', 'Reject');
    formData.append('approval_request_id', selectedActionUUID);
    formData.append('rejection_reason', confirm.toString());

    authAxios
      .post(submittingEndpoints, formData)
      .then(() => {
        setIsProcessing(false);
        mutate();
      })
      .catch(() => {
        setApprovalError('Something went wrong');
      })
      .finally(() => {
        setIsProcessing(false);
        setSelectedActionUUID('');
      });
  };

  return (
    <div className="table-container">
      <h3 className="text-2xl font-semibold p-2 mb-5">List of Approval Requests</h3>

      <RejectionModal
        header="Are you sure you want to Reject this Payment?"
        openModal={openRejectionModal}
        onConfirm={handleRejectApprovalRequest}
      />

      <ConfirmationModal
        header="Are you sure you want to Approve this Payment?"
        openModal={openConfirmationModal}
        onConfirm={handleApproveApprovalRequest}
      />

      <ProcessingModal isProcessing={isProcessing} />

      {approvalError && (
        <InlineNotification
          type="error"
          info="Failed to make an action!"
          disappear_after_time={10000}
        />
      )}

      {error ? (
        <Error />
      ) : isLoading && currentPage === 1 ? (
        <Loading />
      ) : (
        <div className="border border-slate-200 rounded-xl">
          <div className="flex flex-wrap justify-between items-center m-4">
            {/* <div className="flex items-center gap-4">
              <span className="font-semibold pb-1">Filter by</span>
              <span
                className={`inline-flex items-center text-[15px] px-3 pb-1 pt-0.5 border bg-gray-100 text-gray-500 rounded cursor-pointer ${filterPending ? 'bg-violet-600 text-white' : ''}`}
                onClick={handleFilterPending}
              >
                Pending
              </span>
            </div> */}
            <div></div>

            <div onClick={handleRefresh}>
              <RefreshButton />
            </div>
          </div>

          {approvalRequestList?.length === 0 ? (
            <EmptyList />
          ) : (
            <div className="relative">
              <RefreshComponent isRefreshing={isRefreshing || isValidating} />

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left px-4 py-3 font-medium">ID</th>
                      <th className="text-left px-4 py-3 font-medium">Accountant</th>

                      {(requestType === 'transaction' ||
                        requestType === 'bank-transfer' ||
                        requestType === 'scheduled-payment' ||
                        requestType === 'airtime') && (
                        <th className="text-left px-4 py-3 font-medium">Amount</th>
                      )}

                      {(requestType === 'transaction' ||
                        requestType === 'bank-transfer' ||
                        requestType === 'scheduled-payment' ||
                        requestType === 'airtime') && (
                        <th className="text-left px-4 py-3 font-medium">Receiver</th>
                      )}

                      {requestType === 'bank-transfer' && (
                        <th className="text-left px-4 py-3 font-medium">Account Number</th>
                      )}

                      {requestType === 'bank-transfer' && (
                        <th className="text-left px-4 py-3 font-medium">Institution</th>
                      )}

                      {(requestType === 'transaction' ||
                        requestType === 'bank-transfer' ||
                        requestType === 'scheduled-payment') && (
                        <th className="text-left px-4 py-3 font-medium">Reason</th>
                      )}

                      {requestType === 'scheduled-payment' && (
                        <th className="text-left px-4 py-3 font-medium">Recurring</th>
                      )}
                      {requestType === 'scheduled-payment' && (
                        <th className="text-left px-4 py-3 font-medium">Start At</th>
                      )}

                      {requestType === 'airtime' && (
                        <th className="text-left px-4 py-3 font-medium">Package</th>
                      )}

                      {requestType === 'bulk' && (
                        <th className="text-left px-4 py-3 font-medium">Bulk File</th>
                      )}
                      {requestType === 'bulk' && (
                        <th className="text-left px-4 py-3 font-medium">Remark</th>
                      )}

                      <th className="text-left px-4 py-3 font-medium">Status</th>
                      <th className="text-left px-4 py-3 font-medium">Created At</th>
                      {user_role === 'approver' ? (
                        <th className="text-center px-4 py-3 font-medium">Actions</th>
                      ) : undefined}
                    </tr>
                  </thead>

                  <tbody>
                    {approvalRequestList.map((t: ApprovalRequesType) => (
                      <React.Fragment key={t.uuid}>
                        <tr
                          className={`text-nowrap ${t.approvers.length > 0 && showDetailID === t.uuid ? '' : 'hover:bg-slate-100'}`}
                          onClick={() => setShowDetailID(showDetailID === t.uuid ? null : t.uuid)}
                        >
                          <td
                            title={t.uuid}
                            className="relative border-b border-slate-200 p-3 cursor-pointer"
                            onClick={() => copyTransactionID(t.uuid)}
                          >
                            {`${t.uuid.slice(0, 3)}...${t.uuid.slice(-2)}`}
                            <span
                              className={`${copiedID === t.uuid ? '' : 'hidden'} absolute -top-2 left-4 z-10 w-30 text-center text-white bg-black opacity-70 text-sm px-3 py-1 rounded-lg`}
                            >
                              ID Copied
                            </span>
                          </td>

                          <td className="border-b border-slate-200 p-3">
                            {capitalize(
                              t.requesting_user?.user?.first_name +
                                ' ' +
                                t.requesting_user?.user?.last_name
                            )}
                          </td>

                          {(requestType === 'transaction' ||
                            requestType === 'bank-transfer' ||
                            requestType === 'scheduled-payment') && (
                            <td className="border-b border-slate-200 p-3">
                              {t.request_json?.amount?.toFixed(2)}{' '}
                              <span className="text-gray-500 text-sm">ETB</span>
                            </td>
                          )}

                          {requestType === 'airtime' && (
                            <td className="border-b border-slate-200 p-3">
                              {t.request_json?.amount
                                ? t.request_json?.amount
                                : packages?.find(
                                    (p: { code: string; amount: number; name: string }) =>
                                      p.code == t.request_json?.package
                                  )?.amount}{' '}
                              <span className="text-gray-500 text-sm">ETB</span>
                            </td>
                          )}

                          {requestType === 'transaction' && (
                            <>
                              <td className="border-b border-slate-200 p-3">
                                {t.request_json?.receiver}
                              </td>

                              <td className="border-b border-slate-200 p-3 text-wrap">
                                {t.request_json?.cause}
                              </td>
                            </>
                          )}

                          {requestType === 'scheduled-payment' && (
                            <>
                              <td className="border-b border-slate-200 p-3">
                                {t.request_json?.account_number}
                              </td>

                              <td className="border-b border-slate-200 p-3 text-wrap">
                                {t.request_json?.reason}
                              </td>

                              <td className="border-b border-slate-200 p-3">
                                {t.request_json?.recurring}
                              </td>

                              <td className="border-b border-slate-200 p-3 text-gray-500 text-wrap tracking-normal">
                                {formatDate(t.request_json?.start_at)}
                              </td>
                            </>
                          )}

                          {requestType === 'bank-transfer' && (
                            <>
                              <td className="border-b border-slate-200 p-3 text-wrap">
                                {t.request_json?.full_name}
                              </td>

                              <td className="border-b border-slate-200 p-3">
                                {t.request_json?.account_number}
                              </td>

                              <td className="border-b border-slate-200 p-3 text-wrap">
                                {t.request_json?.institution_code && isInstitutionListLoading ? (
                                  <SmallLoading />
                                ) : null}
                                {t.request_json?.institution_code
                                  ? institutionList?.find(
                                      (i: { code: string; name: string }) =>
                                        i.code == t.request_json?.institution_code
                                    ).name
                                  : '-'}
                              </td>

                              <td className="border-b border-slate-200 p-3 text-wrap">
                                {t.request_json?.sender_note}
                              </td>
                            </>
                          )}

                          {requestType === 'airtime' && (
                            <>
                              <td className="border-b border-slate-200 p-3">
                                {t.request_json?.phone}
                              </td>

                              <td className="border-b border-slate-200 p-3 text-wrap">
                                {t.request_json?.package && isPackagesLoading ? (
                                  <SmallLoading />
                                ) : null}
                                {t.request_json?.package
                                  ? packages?.find(
                                      (p: { code: string; amount: number; name: string }) =>
                                        p.code == t.request_json?.package
                                    )?.name
                                  : 'Airtime'}
                              </td>
                            </>
                          )}

                          {requestType === 'bulk' && (
                            <>
                              <td
                                className="border-b border-slate-200 p-3"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {t.file ? (
                                  <a
                                    href={t.file}
                                    download={`YaYa_Scheduled_Bulk_Request_${t.file}`}
                                    className="inline-flex gap-x-2 items-center text-blue-600 hover:text-blue-700 hover:underline"
                                  >
                                    Download
                                    <span className="text-sm">
                                      <BsDownload />
                                    </span>{' '}
                                  </a>
                                ) : (
                                  '~'
                                )}
                              </td>

                              <td className="border-b border-slate-200 p-3 text-wrap">
                                {t.remark || '~'}
                              </td>
                            </>
                          )}

                          <td className="border-b border-slate-200 py-3">
                            <span
                              className={`inline-block align-middle pb-0.5 pr-1 text-[16px] text-${t.rejected_by.length > 0 || t.is_successful === false ? 'red' : t.approved_by.length === t.approvers.length || t.is_successful ? 'green' : 'orange'}-500`}
                            >
                              <GoDotFill />
                            </span>
                            {t.is_successful === true
                              ? 'Succeeded'
                              : t.is_successful === false
                                ? 'Failed'
                                : t.rejected_by.length > 0
                                  ? 'Rejected'
                                  : t.approved_by.length === t.approvers.length
                                    ? 'Approved'
                                    : 'Pending'}
                          </td>

                          <td className="border-b border-slate-200 p-3 text-gray-500 text-wrap tracking-normal">
                            {formatDate(t.created_at)}
                          </td>

                          <td
                            className={`${user_role === 'approver' ? '' : 'hidden'} relative border-b border-slate-200 p-3`}
                          >
                            {t.approved_by.find((user) => user?.id == user_id) ? (
                              <>
                                <span className="mx-2 font-semibold text-green-500">✓</span>
                                You Approved
                              </>
                            ) : t.rejected_by.find((approver) => approver?.user?.id == user_id) ? (
                              <>
                                <span className="mx-2 font-semibold text-red-500">🞩</span>
                                You Rejected
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  disabled={t.rejected_by.length > 0}
                                  className="pt-0.5 inline-block mr-3 pb-1 px-3 text-white focus:outline-none bg-green-600 rounded hover:bg-green-700 focus:z-10 focus:ring-4 focus:ring-green-300"
                                  onClick={(e) => handleOnApproveClick(e, t.uuid)}
                                >
                                  Approve
                                </button>

                                <button
                                  type="button"
                                  disabled={t.rejected_by.length > 0}
                                  className="inline-block pt-0.5 pb-1 px-3 text-white focus:outline-none bg-red-600 rounded hover:bg-red-700 focus:z-10 focus:ring-4 focus:ring-red-300"
                                  onClick={(e) => handleOnRejectClick(e, t.uuid)}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </td>
                        </tr>

                        <tr className={`${t.approvers.length === 0 ? 'hidden' : ''}`}>
                          <td
                            colSpan={user_role === 'accountant' ? 9 : 10}
                            className={`${showDetailID === t.uuid ? '' : 'hidden'} border shadow-lg pl-5 p-3 pb-10 bg-white`}
                          >
                            <div className={`${t.approvers.length === 0 ? 'hidden' : ''} mb-6`}>
                              <h4 className="font-semibold text-lg mb-1">List of All Approvers</h4>
                              <div className="flex flex-col gap-1">
                                {t.approvers.length > 0 &&
                                  t.approvers.map((approver, index) => (
                                    <span key={index} className="flex gap-x-2">
                                      <span>
                                        <span className="mx-2">●</span>
                                        <span>
                                          {capitalize(
                                            approver?.first_name + ' ' + approver?.last_name
                                          )}
                                        </span>
                                      </span>

                                      <span>
                                        {t.approved_by.find((a) => a.id === approver.id) ? (
                                          <span className="text-green-500 mx-2">
                                            ✓&nbsp;<span className="text-sm">Approved</span>
                                          </span>
                                        ) : t.rejected_by.find(
                                            (a) => a?.user.id === approver.id
                                          ) ? (
                                          <span className="text-red-500 mx-2">
                                            🞩&nbsp;<span className="text-sm">Rejected</span>
                                          </span>
                                        ) : (
                                          <span className="mx-2 text-sm text-gray-500">
                                            ~&nbsp; Pending
                                          </span>
                                        )}
                                      </span>
                                    </span>
                                  ))}
                              </div>
                            </div>

                            <div className={`${t.rejected_by.length === 0 ? 'hidden' : ''} mb-6`}>
                              <h4 className="font-semibold text-lg mb-1">Rejected By</h4>
                              <div className="flex flex-col gap-1">
                                {t.rejected_by.length > 0 &&
                                  t.rejected_by.map((approver, index) => (
                                    <span key={index}>
                                      <span className="mx-2">●</span>
                                      {capitalize(
                                        approver?.user?.first_name + ' ' + approver?.user?.last_name
                                      )}
                                      <br />
                                      <span className="mx-2 font-semibold">
                                        Rejection Reason -{' '}
                                      </span>
                                      <span>{approver?.rejection_reason}</span>
                                    </span>
                                  ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {pageCount > 1 && (
                <Pagination
                  currentPage={currentPage}
                  pageCount={pageCount}
                  total={totalApprovalRequests}
                  perPage={perPage}
                  isLoading={isLoading}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApprovalRequestsList;
