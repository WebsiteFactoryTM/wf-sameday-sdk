import {
  AwbPayment,
  DeliveryInterval,
  PackageType,
  PersonType,
  ShipmentData,
} from "../types";

export const delivery1: Partial<ShipmentData> = {
  // pickupPoint: "261421", // Client pickup point ID
  // packageType: PackageType.SmallPackage, // Regular package
  // packageWeight: 2, // 10kg
  service: "7", // Service ID
  awbPayment: AwbPayment.Client, // Client pays
  // cashOnDelivery: 150, // Cash on delivery value
  // insuredValue: 200, // Insured value
  // thirdPartyPickup: 0, // Not a third-party pickup
  // deliveryInterval: DeliveryInterval["10-13"], // Delivery between 10:00 and 13:00
  awbRecipient: {
    name: "John Doe",
    phoneNumber: "0700000000",
    personType: PersonType.Individual, // Individual recipient
    postalCode: "300111",
    county: "39",
    city: "13762",
    address: "Lunei",
  },
  parcels: [
    {
      weight: 1, // 10kg parcel
      width: 20,
      length: 30,
      height: 20,
    },
  ],
  observation: "Handle with care", // Optional observation
  // currency: "RON", // Romanian currency
};

export const delivery2: ShipmentData = {
  pickupPoint: "261421", // Client pickup point ID
  packageType: PackageType.LargePackage, // Large package
  packageWeight: 25, // 25kg total
  service: "7", // Service ID
  awbPayment: AwbPayment.Receiver, // Receiver pays
  cashOnDelivery: 0, // No cash on delivery
  insuredValue: 500, // Insured value
  thirdPartyPickup: 1, // Third-party pickup
  thirdParty: {
    name: "ABC Logistics",
    county: "Ilfov",
    city: "Otopeni",
    address: "Warehouse 45",
    phoneNumber: "0712345678",
    personType: PersonType.LegalEntity,
    companyName: "ABC Logistics SRL",
    companyCui: "RO123456",
    companyOnrcNumber: "J40/1234/2020",
  },
  deliveryInterval: DeliveryInterval["14-17"], // Delivery between 14:00 and 17:00
  awbRecipient: {
    name: "Tech Corp",
    phoneNumber: "0755555555",
    personType: PersonType.LegalEntity,
    companyName: "Tech Corp SRL",
    companyCui: "RO654321",
    postalCode: "567890",
    county: "Cluj",
    city: "Cluj-Napoca",
    address: "Innovation Blvd 23",
  },
  parcels: [
    { weight: 10, width: 40, length: 50, height: 30 },
    { weight: 15, width: 60, length: 80, height: 40 },
  ],
  observation: "Deliver on the 2nd floor",
  currency: "EUR",
};

export const delivery3: ShipmentData = {
  pickupPoint: "13842",
  packageType: PackageType.Package, // Envelope
  packageWeight: 1, // 1kg
  service: "15",
  awbPayment: AwbPayment.ThirdParty, // Third party pays
  cashOnDelivery: 100, // Cash on delivery value
  cashOnDeliveryReturns: 0, // COD collected by third party
  insuredValue: 150, // Insured value
  thirdPartyPickup: 1, // Pickup from third party
  thirdParty: {
    name: "XYZ Courier",
    phoneNumber: "0733333333",
    county: "Constanta",
    city: "Constanta",
    address: "Seaside Road 10",
    personType: PersonType.LegalEntity,
    companyName: "XYZ Courier SRL",
    companyCui: "RO987654",
  },
  deliveryInterval: DeliveryInterval["19-22"], // Evening delivery
  awbRecipient: {
    name: "Maria Popescu",
    phoneNumber: "0744444444",
    personType: PersonType.Individual,
    postalCode: "900100",
    county: "Constanta",
    city: "Constanta",
    address: "Port Street 34",
  },
  parcels: [
    { weight: 1, awbParcelNumber: "AWB123456" }, // Envelope
  ],
  observation: "Urgent delivery",
  currency: "RON",
  lockerRedirectEligible: 1, // Allow locker redirection
};
