// deno-lint-ignore-file no-namespace

export namespace Base {
  export type Error = {
    code: string;
    message: string;
  };

  export type Money = {
    value: number;
    vat_sum: number;
    var_rate: number;
  };

  export type Threshold = {
    threshold: number;
    sum: number;
    vat_sum: number;
    vat_rate: number;
  };

  export type Location = {
    code?: number;
    fias_guid?: string;
    postal_code?: string;
    longitude?: number;
    latitude?: number;
    country_code?: string;
    region?: string;
    sub_region?: string;
    city?: string;
    kladr_code?: string;
    address: string;
  };
}

export namespace ApiRequest {
  export type OAuth = {
    grant_type: "client_credentials";
    client_id: string;
    client_secret: string;
  };

  export type Regions = {
    country_codes?: string[];
    region_code?: number;
    kladr_region_code?: string;
    fias_region_guid?: string;
    size?: number;
    page?: number;
    lang?: string;
  };
}

export namespace ApiResponse {
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
    errors?: Base.Error[];
  };
}
