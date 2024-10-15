"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryInterval = exports.PersonType = exports.AwbPayment = exports.PackageType = void 0;
var PackageType;
(function (PackageType) {
    PackageType[PackageType["Package"] = 0] = "Package";
    PackageType[PackageType["SmallPackage"] = 1] = "SmallPackage";
    PackageType[PackageType["LargePackage"] = 2] = "LargePackage";
})(PackageType || (exports.PackageType = PackageType = {}));
var AwbPayment;
(function (AwbPayment) {
    AwbPayment[AwbPayment["Client"] = 1] = "Client";
    AwbPayment[AwbPayment["Receiver"] = 2] = "Receiver";
    AwbPayment[AwbPayment["ThirdParty"] = 3] = "ThirdParty";
})(AwbPayment || (exports.AwbPayment = AwbPayment = {}));
var PersonType;
(function (PersonType) {
    PersonType[PersonType["Individual"] = 0] = "Individual";
    PersonType[PersonType["LegalEntity"] = 1] = "LegalEntity";
})(PersonType || (exports.PersonType = PersonType = {}));
var DeliveryInterval;
(function (DeliveryInterval) {
    DeliveryInterval[DeliveryInterval["10-13"] = 1] = "10-13";
    DeliveryInterval[DeliveryInterval["14-17"] = 2] = "14-17";
    DeliveryInterval[DeliveryInterval["19-22"] = 3] = "19-22";
    DeliveryInterval[DeliveryInterval["09-11"] = 4] = "09-11";
    DeliveryInterval[DeliveryInterval["11-13"] = 5] = "11-13";
    DeliveryInterval[DeliveryInterval["13-15"] = 6] = "13-15";
    DeliveryInterval[DeliveryInterval["15-17"] = 7] = "15-17";
    DeliveryInterval[DeliveryInterval["17-19"] = 8] = "17-19";
    DeliveryInterval[DeliveryInterval["19-21"] = 9] = "19-21";
    DeliveryInterval[DeliveryInterval["13-16"] = 10] = "13-16";
    DeliveryInterval[DeliveryInterval["15-18"] = 11] = "15-18";
    DeliveryInterval[DeliveryInterval["13-18"] = 12] = "13-18";
    DeliveryInterval[DeliveryInterval["18-22"] = 13] = "18-22";
    DeliveryInterval[DeliveryInterval["18-20"] = 14] = "18-20";
    DeliveryInterval[DeliveryInterval["20-22"] = 15] = "20-22";
})(DeliveryInterval || (exports.DeliveryInterval = DeliveryInterval = {}));
//# sourceMappingURL=types.js.map