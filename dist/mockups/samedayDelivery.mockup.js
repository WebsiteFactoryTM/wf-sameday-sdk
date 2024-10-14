"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delivery3 = exports.delivery2 = exports.delivery1 = void 0;
const types_1 = require("../types");
exports.delivery1 = {
    service: "7",
    awbPayment: types_1.AwbPayment.Client,
    awbRecipient: {
        name: "John Doe",
        phoneNumber: "0700000000",
        personType: types_1.PersonType.Individual,
        postalCode: "300111",
        county: "39",
        city: "13762",
        address: "Lunei",
    },
    parcels: [
        {
            weight: 1,
            width: 20,
            length: 30,
            height: 20,
        },
    ],
    observation: "Handle with care",
};
exports.delivery2 = {
    pickupPoint: "261421",
    packageType: types_1.PackageType.LargePackage,
    packageWeight: 25,
    service: "7",
    awbPayment: types_1.AwbPayment.Receiver,
    cashOnDelivery: 0,
    insuredValue: 500,
    thirdPartyPickup: 1,
    thirdParty: {
        name: "ABC Logistics",
        county: "Ilfov",
        city: "Otopeni",
        address: "Warehouse 45",
        phoneNumber: "0712345678",
        personType: types_1.PersonType.LegalEntity,
        companyName: "ABC Logistics SRL",
        companyCui: "RO123456",
        companyOnrcNumber: "J40/1234/2020",
    },
    deliveryInterval: types_1.DeliveryInterval["14-17"],
    awbRecipient: {
        name: "Tech Corp",
        phoneNumber: "0755555555",
        personType: types_1.PersonType.LegalEntity,
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
exports.delivery3 = {
    pickupPoint: "13842",
    packageType: types_1.PackageType.Package,
    packageWeight: 1,
    service: "15",
    awbPayment: types_1.AwbPayment.ThirdParty,
    cashOnDelivery: 100,
    cashOnDeliveryReturns: 0,
    insuredValue: 150,
    thirdPartyPickup: 1,
    thirdParty: {
        name: "XYZ Courier",
        phoneNumber: "0733333333",
        county: "Constanta",
        city: "Constanta",
        address: "Seaside Road 10",
        personType: types_1.PersonType.LegalEntity,
        companyName: "XYZ Courier SRL",
        companyCui: "RO987654",
    },
    deliveryInterval: types_1.DeliveryInterval["19-22"],
    awbRecipient: {
        name: "Maria Popescu",
        phoneNumber: "0744444444",
        personType: types_1.PersonType.Individual,
        postalCode: "900100",
        county: "Constanta",
        city: "Constanta",
        address: "Port Street 34",
    },
    parcels: [
        { weight: 1, awbParcelNumber: "AWB123456" },
    ],
    observation: "Urgent delivery",
    currency: "RON",
    lockerRedirectEligible: 1,
};
//# sourceMappingURL=samedayDelivery.mockup.js.map