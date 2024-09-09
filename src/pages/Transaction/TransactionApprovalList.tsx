import ApprovalRequestsList from '../../components/ApprovalRequestsList';

const TransactionApprovalList = () => {
  return (
    <ApprovalRequestsList
      requestType="transaction"
      requestsListEndpoint="transaction/transaction-requests"
      submittingEndpoints="transaction/submit-transaction-response"
    />
  );
};

export default TransactionApprovalList;
