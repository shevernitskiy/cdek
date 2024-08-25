export type UpdateType =
  | "ORDER_STATUS"
  | "PRINT_FORM"
  | "DOWNLOAD_PHOTO"
  | "PREALERT_CLOSED";

export type OrderStatus =
  | "CREATED"
  | "REMOVED"
  | "RECEIVED_AT_SHIPMENT_WAREHOUSE"
  | "READY_TO_SHIP_AT_SENDING_OFFICE"
  | "RETURNED_TO_SENDER_WAREHOUSE"
  | "PASSED_TO_CARRIER_AT_SENDING_OFFICE"
  | "SEND_TO_TRANSIT_OFFICE"
  | "MET_AT_TRANSIT_OFFICE"
  | "ACCEPTED_TO_OFFICE_TRANSIT_WAREHOUSE"
  | "RETURNED_TO_TRANSIT_WAREHOUSE"
  | "READY_TO_SHIP_IN_TRANSIT_OFFICE"
  | "PASSED_TO_CARRIER_AT_TRANSIT_OFFICE"
  | "SEND_TO_SENDING_OFFICE"
  | "SEND_TO_RECIPIENT_OFFICE"
  | "MET_AT_SENDING_OFFICE"
  | "MET_AT_RECIPIENT_OFFICE"
  | "ACCEPTED_AT_DELIVERY_WAREHOUSE"
  | "ACCEPTED_AT_WAREHOUSE_ON_DEMAND"
  | "ISSUED_FOR_DELIVERY"
  | "RETURNED_TO_DELIVERY_WAREHOUSE"
  | "DELIVERED"
  | "NOT_DELIVERED"
  | "ENTERED_TO_OFFICE_TRANSIT_WAREHOUSE"
  | "ENTERED_TO_DELIVERY_WAREHOUSE"
  | "ENTERED_TO_WAREHOUSE_ON_DEMAND"
  | "IN_CUSTOMS_INTERNATIONAL"
  | "SHIPPED_TO_DESTINATION"
  | "PASSED_TO_TRANSIT_CARRIER"
  | "IN_CUSTOMS_LOCAL"
  | "CUSTOMS_COMPLETE"
  | "POSTOMAT_POSTED"
  | "POSTOMAT_SEIZED"
  | "POSTOMAT_RECEIVED"
  | "READY_FOR_SHIPMENT_IN_SENDER_CITY"
  | "TAKEN_BY_TRANSPORTER_FROM_SENDER_CIT"
  | "SENT_TO_TRANSIT_CIT"
  | "ACCEPTED_IN_TRANSIT_CIT"
  | "ACCEPTED_AT_TRANSIT_WAREHOUS"
  | "TAKEN_BY_TRANSPORTER_FROM_TRANSIT_CITY"
  | "SENT_TO_RECIPIENT_CITY"
  | "ACCEPTED_IN_RECIPIENT_CITY"
  | "ACCEPTED_AT_PICK_UP_POINT"
  | "TAKEN_BY_COURIER"
  | "RETURNED_TO_RECIPIENT_CITY_WAREHOUSE";

export type UpdateBase = {
  type: UpdateType;
  date_time: string;
  uuid: string;
};

export type UpdateOrderStatus = UpdateBase & {
  attributes: {
    is_return: boolean;
    cdek_number: string;
    number?: string;
    status_code: string;
    status_reason_code: string;
    status_date_time: string;
    city_name: string;
    city_code?: string;
    code: OrderStatus;
    is_reverse: boolean;
    is_client_return: boolean;
    related_entities: {
      type: "direct_order" | "client_direct_order";
      cdek_number: string;
      uuid: string;
    }[];
  };
};

export type UpdatePrintForm = UpdateBase & {
  attributes: {
    type: "waybill" | "receipt" | "barcode";
    url: string;
  };
};

export type UpdateDownloadPhoto = UpdateBase & {
  attributes: {
    cdek_number: string;
    link: string;
  };
};

export type UpdatePrealertClosed = UpdateBase & {
  attributes: {
    prealert_number: string;
    closed_date: string;
    fact_shipment_point: string;
  };
};

export type EventMap = {
  ORDER_STATUS: [UpdateOrderStatus];
  PRINT_FORM: [UpdatePrintForm];
  DOWNLOAD_PHOTO: [UpdateDownloadPhoto];
  PREALERT_CLOSED: [UpdatePrealertClosed];
};
