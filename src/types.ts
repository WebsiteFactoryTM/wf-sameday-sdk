export enum PackageType {
  Package = 0,
  SmallPackage = 1,
  LargePackage = 2,
}

export enum AwbPayment {
  Client = 1,
  Receiver = 2,
  ThirdParty = 3,
}

export enum PersonType {
  Individual = 0,
  LegalEntity = 1,
}

export enum DeliveryInterval {
  "10-13" = 1, // 10:00 - 13:00 (3H)
  "14-17" = 2, // 14:00 - 17:00 (3H)
  "19-22" = 3, // 19:00 - 22:00 (3H)
  "09-11" = 4, // 09:00 - 11:00 (2H)
  "11-13" = 5, // 11:00 - 13:00 (2H)
  "13-15" = 6, // 13:00 - 15:00 (2H)
  "15-17" = 7, // 15:00 - 17:00 (2H)
  "17-19" = 8, // 17:00 - 19:00 (2H)
  "19-21" = 9, // 19:00 - 21:00 (2H)
  "13-16" = 10, // 13:00 - 16:00 (2H)
  "15-18" = 11, // 15:00 - 18:00 (2H)
  "13-18" = 12, // 13:00 - 18:00 (6H)
  "18-22" = 13, // 18:00 - 22:00 (6H)
  "18-20" = 14, // Pc Garage: 18:00 - 20:00 (2H)
  "20-22" = 15, // Pc Garage: 20:00 - 22:00 (2H)
}

export declare interface ThirdPartyDetails {
  county?: string;
  city?: string;
  address?: string;
  name?: string;
  phoneNumber?: string;
  personType?: PersonType;
  cityString?: string;
  countyString?: string;
  companyName?: string;
  companyCui?: string;
  companyOnrcNumber?: string;
  companyIban?: string;
  companyBank?: string;
}

export declare interface AWBRecipientDetails {
  name: string;
  phoneNumber: string;
  personType: PersonType;
  companyName?: string;
  companyCui?: string;
  companyOnrcNumber?: string;
  companyIban?: string;
  companyBank?: string;
  postalCode?: string;
  county?: string;
  city?: string;
  cityString?: string;
  countyString?: string;
  address?: string;
}

export declare interface ParcelDetails {
  weight: number;
  width?: number;
  length?: number;
  height?: number;
  awbParcelNumber?: string;
}

export declare interface ShipmentData {
  pickupPoint: string; // Client pickup point ID
  returnLocationId?: string; // Optional: Client return pickup point ID
  contactPerson?: string; // Optional: Client contact person ID
  packageType: PackageType; // 0 -> package, 1 -> small package, 2 -> large package
  packageNumber?: number; // Optional: Number of packages
  packageWeight: number; // Total package weight (kg)
  service: string; // Service ID
  awbPayment: AwbPayment; // 1 -> client
  cashOnDelivery: number; // Cash on delivery (can be 0)
  cashOnDeliveryReturns?: number; // Optional: Default 1 (client); 0 -> third party
  insuredValue: number; // Insured value for AWB (all packages)
  thirdPartyPickup?: 0 | 1; // 0 -> client's pickup points; 1 -> third party pickup
  thirdParty?: object; // Mandatory if thirdPartyPickup is 1
  serviceTaxes?: string[]; // Optional field for service taxes
  deliveryInterval?: DeliveryInterval; // Optional: Delivery interval (specific to services)
  awbRecipient: AWBRecipientDetails;
  clientInternalReference?: string; // Optional: client internal reference
  parcels: ParcelDetails[]; // Array of package details
  observation?: string; // Optional: AWB observations
  priceObservation?: string; // Optional: Price observations
  currency?: string; // Optional: Currency code for monetary fields
  lockerRedirectEligible?: number; // Optional: Locker redirection flag
  lockerFirstMile?: number; // Optional: For C2C and locker return services
  lockerLastMile?: number; // Optional: For C2C and locker delivery services
  oohFirstMile?: number; // Optional: OutOfHome first mile location
  oohLastMile?: number; // Optional: OutOfHome last mile location
  clientId?: string; // Optional: Client ID
  orderNumber?: string; // Optional: Order number
  returnLockerParcel?: object; // Optional: Return locker parcel details
  clientOohParcel?: object; // Optional: OutOfHome parcel details
  clientObservation?: string; // Optional: Other client observations
  awbNumber?: string; // Optional: Barcode for parcels and AWBs
  lockerId?: number; // Optional: Deprecated field for locker services
  fulfillmentType?: 1 | 2; // Optional: 1 -> Dante AWB; 2 -> Third-party AWB
  geniusOrder?: number; // Optional: Flag for genius orders
  orderDate?: string; // Optional: Date for genius AWB
  pickupStartDate?: string; // Optional: Pick up start date for return operation
  pickupEndDate?: string; // Optional: Pick up end date for return operation
  returnAwbs?: string[]; // Optional: Array for return AWBs
  optionalPickupReturns?: number; // Optional: Flag for pickup returns
  forwardedTC?: object; // Optional: Forwarded TC details
  standbyReturn?: number; // Optional: Flag for standby return
}

export declare interface AWB {
  awbNumber: string;
  awbCost: 0;
  pdfLink: string;
  pickupLogisticLocation: string;
  deliveryLogisticLocation: string;
  deliveryLogisticCircle: string;
  sortingHub: string;
  lockerReturnChargeCode: string;
  deliveryZone: string;
  deliveryCourier: string;
  oohClientChargeCode: string;
}

export declare interface ServiceType {
  id: number;
  name?: string;
  serviceCode?: string;
  deliveryType?: {
    id?: string;
    name?: string;
  };
  defaultService?: boolean;
  serviceOptionalTaxes?: {
    costType: string;
    name: string;
    taxCode: string;
    id: number;
    tax: number;
    packageType: number;
  };
}

export declare interface PickupPointResponse {
  total: number;
  currentPage: number;
  pages: number;
  perPage: number;
  data: PickupPoint[];
}

export declare interface PickupPoint {
  country: {
    id: number;
    name: string;
    code: string;
  };
  id: number;
  county: {
    id: number;
    name: string;
    code: string;
  };
  city: {
    samedayDeliveryAgency: string;
    samedayPickupAgency: string;
    id: number;
    name: string;
    extraKM: number;
  };
  address: string;
  postalCode: string;
  defaultPickupPoint: boolean;
  pickupPointContactPerson: {
    id: number;
    name: string;
    position: string;
    phoneNumber: string;
    email: string;
    defaultContactPerson: boolean;
    nationality: string;
    nationalID: string;
  };
  alias: string;
  cutOff: string;
  deliveryInterval: string;
  status: boolean;
}

export declare interface CityQueryParams {
  name?: string;
  county?: string;
  postalCode?: string;
  countryCode?: string;
  page?: number;
  countPerPage?: number;
}

export declare interface City {
  samedayDeliveryAgencyId: number;
  samedayDeliveryAgency: string;
  samedayPickupAgency: string;
  nextDayDeliveryAgencyId: number;
  nextDayDeliveryAgency: string;
  nextDayPickupAgency: string;
  whiteDeliveryAgencyId: number;
  whiteDeliveryAgency: string;
  whitePickupAgency: string;
  logisticCircle: string;
  country: {
    id: number;
    name: string;
    code: string;
  };
  id: number;
  name: string;
  extraKM: number;
  village: string;
  brokerDelivery: number;
  postalCode: string;
  county: {
    name: string;
    id: number;
    code: string;
  };
}

export declare interface GetCitiesResponse {
  total: number;
  currentPage: number;
  pages: number;
  perPage: number;
  data: City[];
}

export declare interface CountyQueryParams {
  name?: string;
  countryCode?: string;
  page?: number;
  countPerPage?: number;
}

export declare interface County {
  countryId: 0;
  country: "string";
  id: 0;
  name: "string";
  code: "string";
}
export declare interface GetCountiesResponse {
  total: number;
  currentPage: number;
  pages: number;
  perPage: number;
  data: County[];
}
