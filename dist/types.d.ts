export declare enum PackageType {
    Package = 0,
    SmallPackage = 1,
    LargePackage = 2
}
export declare enum AwbPayment {
    Client = 1,
    Receiver = 2,
    ThirdParty = 3
}
export declare enum PersonType {
    Individual = 0,
    LegalEntity = 1
}
export declare enum DeliveryInterval {
    "10-13" = 1,
    "14-17" = 2,
    "19-22" = 3,
    "09-11" = 4,
    "11-13" = 5,
    "13-15" = 6,
    "15-17" = 7,
    "17-19" = 8,
    "19-21" = 9,
    "13-16" = 10,
    "15-18" = 11,
    "13-18" = 12,
    "18-22" = 13,
    "18-20" = 14,
    "20-22" = 15
}
export declare type Connection = {
    username: string | undefined;
    password: string | undefined;
    apiUrl: string;
    sandbox?: boolean;
};
export declare type DefaultShipmentData = Partial<ShipmentData>;
export declare interface SamedayClient {
    authenticate: () => Promise<string | null>;
    createShipment: (shipmentData: Partial<ShipmentData>) => Promise<AWB | undefined>;
    getServices: () => Promise<void | ServiceType[]>;
    trackShipment: (awb: string) => Promise<any>;
    setPickupPoint: (newPickupPoint: string) => void;
    getPickupPoints: (page?: number, perPage?: number) => Promise<void | PickupPointResponse>;
    getCities: (queryParams?: CityQueryParams) => Promise<void | GetCitiesResponse>;
    getCounties: (queryParams?: CountyQueryParams) => Promise<void | GetCountiesResponse>;
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
    pickupPoint: string;
    returnLocationId?: string;
    contactPerson?: string;
    packageType: PackageType;
    packageNumber?: number;
    packageWeight: number;
    service: string;
    awbPayment: AwbPayment;
    cashOnDelivery: number;
    cashOnDeliveryReturns?: number;
    insuredValue: number;
    thirdPartyPickup?: 0 | 1;
    thirdParty?: object;
    serviceTaxes?: string[];
    deliveryInterval?: DeliveryInterval;
    awbRecipient: AWBRecipientDetails;
    clientInternalReference?: string;
    parcels: ParcelDetails[];
    observation?: string;
    priceObservation?: string;
    currency?: string;
    lockerRedirectEligible?: number;
    lockerFirstMile?: number;
    lockerLastMile?: number;
    oohFirstMile?: number;
    oohLastMile?: number;
    clientId?: string;
    orderNumber?: string;
    returnLockerParcel?: object;
    clientOohParcel?: object;
    clientObservation?: string;
    awbNumber?: string;
    lockerId?: number;
    fulfillmentType?: 1 | 2;
    geniusOrder?: number;
    orderDate?: string;
    pickupStartDate?: string;
    pickupEndDate?: string;
    returnAwbs?: string[];
    optionalPickupReturns?: number;
    forwardedTC?: object;
    standbyReturn?: number;
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
//# sourceMappingURL=types.d.ts.map