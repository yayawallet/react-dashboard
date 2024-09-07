export interface UserProfile {
  id: string;
  name: string;
  account: string;
  email: null | string;
  guardians: string[];
  location: string;
  country: {
    name: string;
    phone_code: string;
  };
  gender: null | string;
  region: null | string;
  phone: string;
  currency: string;
  type: string;
  status: string;
  photo_url: null | string;
  id_doc_front_url: null | string;
  id_doc_back_url: null | string;
  reputation: number;
  date_of_birth: Date;
  created_at_time: Date;
  balance_limit: number;
  daily_transaction_limit: number;
}

export interface User {
  id: string;
  name: string;
  account: string;
  currency: string;
  type: string;
  status: string;
  photo_url: null | string;
  cause_required: boolean;
}

export interface QRCode {
  qr_image_url: string;
  payment_link: string;
}

export interface Transfer {
  id: string;
  name: string;
  email: string;
  amount: number;
  amount_in_base_currency: number;

  currency: string;
  payment_method: {
    account_number: string;
    full_name: string;
    institution: {
      code: string;
      name: string;
      logo_url: string;
    };
  };
  phone: string;
  ref_code: string;
  user: {
    name: string;
    account: string;
  };
  created_at_time: Date;
}

export interface TransactionType {
  id: string;
  sender: {
    name: string;
    account: string;
  };
  receiver: {
    name: string;
    account: string;
  };
  amount_with_currency: string;
  amount: number;
  amount_in_base_currency: number;
  currency: string;
  cause: string;
  sender_caption: string;
  receiver_caption: string;
  created_at_time: Date;
  is_topup: boolean;
  is_outgoing_transfer: boolean;
}

export interface Institution {
  institution_id: string;
  code: string;
  name: string;
  country: {
    name: string;
    phone_code: string;
  };
  logo_url: string;
  full_name: string;
  account_number: string;
  phone: string;
  photo_url: null | string;
}

export interface Fee {
  fee: number;
  currency: string;
}

export interface EXternalAccount {
  account_number: string;
  full_name: string;
  institution: Institution;
  phone: string;
  photo_url: string;
}

export interface TopUp {
  amount: number;
  id: string;
  phone: string;
  user: {
    name: string;
    account: string;
  };
}

export interface Package {
  code: string;
  category: string;
  name: string;
  amount: number;
}

export interface Recharge {
  id: string;
  user: {
    name: string;
    account: string;
  };
  amount: number;
  phone: string;
}

export interface ScheduledPayment {
  id: string;
  customer: {
    name: string;
    account: string;
    photo_url: string;
  };
  receiver_institution: {
    code: string;
    name: string;
    logo_url: string;
  };
  receiver: {
    name: string;
    account: string;
    photo_url: null | string;
  };
  account_number: string;
  amount: number;
  next_run_time: Date;
  status: string;
  recurring_type: string;
}

// Recurring - Contrat
export interface recurringContract {
  id: string;
  merchant: {
    name: string;
    account: string;
  };
  customer: {
    name: string;
    account: string;
  };
  contract_number: string;
  service_type: string;
  status: string;
}

export interface ReportType {
  uuid: string;
  successful_count: number;
  failed_count: number;
  file_name: string;
  remark: string;
  created_at: Date;
}

export interface ReportDetailType {
  uuid: string;
  row_number: number;
  error_message: string;
  created_at: Date;
}

export interface BillListType {
  id: string;
  client_yaya_account: {
    name: string;
    account: string;
  };
  customer_yaya_account: {
    name: string;
    account: string;
  };
  amount: number;
  paid: number;
  forwarded: number;
  phone: string;
  currency: string;
  customer_id: string;
  bill_id: string;
  bill_code: string;
  bill_season: string;
  description: string;
  cluster: string;
  start_at: Date;
  due_at: Date;
  email: string;
  status: string;
  amount_due: number;
}

export interface BillDetailType {
  id: string;
  client_yaya_account: {
    name: string;
    account: string;
  };
  currency: string;
  customer_id: string;
  bill_id: string;
  bill_code: string;
  bill_season: string;
  description: string;
  cluster: string;
  start_at: Date;
  due_at: Date;
  due_at_time: Date;
  amount: number;
  amount_due: number;
  service_charge: number;
  total_due: number;
}

export interface BulkBillStatus {
  id: string;
  submitted_records: number;
  imported_records: number;
  failed: Object[];
  failed_records: number;
  status: string;
  createdAt: Date;
}

export interface PayoutMethodType {
  id: string;
  client_yaya_account: {
    name: string;
    account: string;
  };
  cluster: string;
  bill_code: string;
  institution: {
    institution_id: string;
    code: string;
    name: string;
  };
  account_number: string;
  createdAt: Date;
}

export interface ApprovalRequesType {
  uuid: string;
  is_successful: boolean | null;
  requesting_user: {
    user: {
      id: number;
      first_name: string;
      last_name: string;
    };
    phone: string;
  };
  approved_by: {
    id: number;
    first_name: string;
    last_name: string;
  }[];
  rejected_by: {
    user: {
      id: number;
      first_name: string;
      last_name: string;
    };
    rejection_reason: string;
  }[];
  approvers: {
    id: number;
    first_name: string;
    last_name: string;
  }[];
  request_type: string;
  request_json: {
    receiver: string;
    amount: number;
    cause: string;

    account_number: string;
    reason: string;
    recurring: string;
    start_at: Date;

    institution_code: string;
    sender_note: string;

    phone: string;
    package: string;
  };
  file: string;
  remark: string;
  created_at: Date;
}
