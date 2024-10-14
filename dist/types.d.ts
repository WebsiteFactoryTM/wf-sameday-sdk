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
//# sourceMappingURL=types.d.ts.map