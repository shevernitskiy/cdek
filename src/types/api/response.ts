import type {
  Contact,
  EntityOperation,
  Error,
  Location,
  Money,
  Package,
  Phone,
  ReceivePrintFrom,
  Request,
  Seller,
  Service,
  Status,
  Threshold,
  Warning,
} from "./base.ts";

export type OAuth = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  jti: string;
};

export type GetRegions = {
  country_code: string;
  country: string;
  region: string;
  prefix?: string;
  region_code?: number;
  kladr_region_code?: string;
  fias_region_guid?: string;
  errors?: Error[];
};

export type GetOrder = {
  entity?: {
    uuid: string;
    is_return: boolean;
    is_reverse: boolean;
    type: number;
    additional_order_types?: number;
    cdek_number?: string;
    number?: string;
    delivery_mode?: string;
    tariff_code: number;
    comment?: string;
    developer_key?: string;
    shipment_point?: string;
    delivery_point?: string;
    date_invoice?: string;
    shipper_name?: string;
    shipper_address?: string;
    delivery_recipient_cost?: Money;
    delivery_recipient_cost_adv?: Threshold[];
    sender: Contact;
    seller?: Seller;
    recipient: Contact;
    from_location: Location;
    to_location: Location;
    services?: Service[];
    packages: (Package & {
      package_id: string;
      weight_volume?: number;
      weight_calc?: number;
    })[];
    delivery_problem?: {
      code?: string;
      create_date?: string;
    }[];
    delivery_date?: string;
    delivery_detail?: {
      date?: string;
      recipient_name?: string;
      payment_sum?: number;
      payment_info?: {
        type: "CARD" | "CASH";
        sum: number;
      }[];
      delivery_sum: number;
      total_sum: number;
    };
    transacted_payment?: boolean;
    statuses: Status[];
    calls?: {
      failed_calls?: {
        date_time: string;
        reason_code: number;
      }[];
      rescheduled_calls?: {
        date_time: string;
        date_next: string;
        time_next: string;
        comment?: string;
      }[];
    };
  };
  requests?: Request[];
  related_entities?: {
    type: "return_order" | "direct_order" | "barcode" | "waybill" | "reverse_order" | "delivery";
    uuid: string;
    url?: string;
    cdek_number?: string;
    date?: string;
    time_from?: string;
    time_to?: string;
  }[];
};

export type GetCourierDetails = {
  entity?: {
    uuid: string;
    intake_number?: number;
    cdek_number?: number;
    order_uuid?: string;
    intake_date: string;
    intake_time_from: string;
    intake_time_to: string;
    lunch_time_from?: string;
    lunch_time_to?: string;
    name?: string;
    weight?: number;
    length?: number;
    width?: number;
    height?: number;
    comment?: string;
    sender?: Contact;
    from_location: Location;
    need_call?: boolean;
    statuses: Status[];
    courier_power_of_attorney?: boolean;
    courier_identity_card?: boolean;
  };
  requests: Request[];
};

export type GetDeliveryAppointment = {
  entity?: {
    uuid: string;
    cdek_number?: string;
    order_uuid: string;
    date: string;
    time_from?: string;
    time_to?: string;
    comment?: string;
    delivery_point?: string;
    to_location?: Location;
    statuses: Status[];
  };
  requests: Request[];
};

export type GetPrealert = {
  entity?: {
    uuid: string;
    prealert_number?: string;
    planned_date: string;
    shipment_point: string;
    orders: {
      order_uuid: string;
      cdek_number: number;
      im_number: string;
    }[];
  };
  requests: Request[];
};

export type GetPassportData = {
  orders?: {
    order_uuid: string;
    cdek_number: number;
    passport: {
      client: string;
      passport_requirements_satisfied: boolean;
    }[];
  }[];
  errors?: Error[];
  warnings?: Warning[];
};

export type GetCashboxCheck = {
  check_info?: {
    order_uuid: string;
    cdek_number: number;
    date: string;
    fiscal_storage_number: string;
    document_number: string;
    fiscal_sign: number;
    type: string;
    payment_info: {
      sum: number;
      type: string;
    }[];
  }[];
  errors?: Error[];
};

export type GetCashOnDeliveryRegistry = {
  registries?: {
    registry_number: number;
    payment_date?: string;
    sum: number;
    payment_order_number?: string;
    orders: {
      cdek_number: string;
      transfer_sum: number;
      payment_sum: number;
      total_sum_without_agent: number;
      agent_commission_sum: number;
    }[];
  }[];
  errors?: Error[];
};

export type GetCashOnDeliveryTransfer = {
  orders?: {
    order_uuid: string;
    cdek_number: number;
    number: string;
  }[];
  errors?: Error[];
};

export type GetPickupPoints = {
  code: string;
  name: string;
  location: Location & { address_full: string };
  address_comment?: string;
  nearest_station: string;
  nearest_metro_station?: string;
  work_time: string;
  phones: Phone[];
  email: string;
  note: string;
  type: "PVZ" | "POSTAMAT";
  owner_code: string;
  take_only: boolean;
  is_handout: boolean;
  is_reception: boolean;
  is_dressing_room: string;
  have_cashless: string;
  have_cash: boolean;
  allowed_cod: string;
  site?: string;
  office_image_list: {
    url: string;
    number: number;
  }[];
  work_time_list: {
    day: number;
    time: string;
  }[];
  work_time_exceptions?: {
    date: string;
    time?: string;
    is_working: boolean;
  }[];
  weight_min: number;
  weight_max?: number;
  fulfillment: boolean;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  }[];
  errors?: Error[];
};

export type ReceiveOrderReceipt = ReceivePrintFrom;
export type ReceiveBarcodeCP = ReceivePrintFrom;

export type AddWebhook = EntityOperation & {
  related_entities: {
    type: string;
    uuid: string;
  }[];
};
export type AddOrder = EntityOperation;
export type UpdateOrder = EntityOperation;
export type DeleteOrder = EntityOperation;
export type AddRefusal = EntityOperation;
export type AddCourier = EntityOperation;
export type DeleteCourier = EntityOperation;
export type CreateOrderReceipt = EntityOperation;
export type CreateBarcodeCP = EntityOperation;
export type AddDeliveryAppointment = EntityOperation;
export type AddPrealert = EntityOperation;
