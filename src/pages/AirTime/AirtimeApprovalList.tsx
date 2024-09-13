import ApprovalRequestsList from '../../components/ApprovalRequestsList';

const AirtimeApprovalList = () => {
  return (
    <ApprovalRequestsList
      requestType="airtime"
      requestsListEndpoint="airtime/airtime-requests"
      submittingEndpoints="airtime/submit-airtime-response"
    />
  );
};

export default AirtimeApprovalList;
