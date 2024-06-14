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
}

export interface Transaction {
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
  on_queue_count: number;
  // total_count: number;
  file_name: string;
  remark: string;
  created_at: Date;
}
