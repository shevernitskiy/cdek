import type {
  Contact,
  EntityOperation,
  Error,
  Location,
  Money,
  Package,
  Request,
  Seller,
  Service,
  Status,
  Threshold,
} from "./base.ts";

export type OAuth = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  jti: string;
};

export type Regions = {
  country_code: string;
  country: string;
  region: string;
  prefix?: string;
  region_code?: number;
  kladr_region_code?: string;
  fias_region_guid?: string;
  errors?: Error[];
};

export type AddWebhook = {
  entity?: {
    uuid?: string;
  };
  requests: Request[];
};

export type AddOrder = EntityOperation;
export type UpdateOrder = EntityOperation;
export type DeleteOrder = EntityOperation;

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
