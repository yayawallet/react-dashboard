import ApprovalRequestsList from '../../components/ApprovalRequestsList';

const BankTransferApprovalList = () => {
  return (
    <ApprovalRequestsList
      requestType="bank-transfer"
      requestsListEndpoint="transfer/transfer-requests"
      submittingEndpoints="transfer/submit-transfer-response"
    />
  );
};

export default BankTransferApprovalList;
