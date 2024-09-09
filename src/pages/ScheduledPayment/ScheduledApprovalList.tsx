import ApprovalRequestsList from '../../components/ApprovalRequestsList';

const ScheduledApprovalList = () => {
  return (
    <ApprovalRequestsList
      requestType="scheduled-payment"
      requestsListEndpoint="scheduled-payment/scheduled-requests"
      submittingEndpoints="scheduled-payment/submit-scheduled-response"
    />
  );
};

export default ScheduledApprovalList;
