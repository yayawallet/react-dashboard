import ApprovalRequestsList from '../../components/ApprovalRequestsList';

const ScheduledBulkApprovalList = () => {
  return (
    <ApprovalRequestsList
      requestType="bulk"
      requestsListEndpoint="scheduled-payment/scheduled-bulk-requests"
      submittingEndpoints="scheduled-payment/submit-bulk-schedule-response"
    />
  );
};

export default ScheduledBulkApprovalList;
