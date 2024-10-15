"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const samedaySDK_1 = __importDefault(require("./samedaySDK"));
const samedayDelivery_mockup_1 = require("./mockups/samedayDelivery.mockup");
dotenv_1.default.config();
const { SAMEDAY_SANDBOX_API_URL, SAMEDAY_USERNAME, SAMEDAY_PASSWORD } = process.env;
const sameday = (0, samedaySDK_1.default)({
    username: SAMEDAY_USERNAME,
    password: SAMEDAY_PASSWORD,
    apiUrl: SAMEDAY_SANDBOX_API_URL,
    sandbox: true,
});
sameday.getCounties();
sameday.getCities({ county: "39" });
sameday.getServices();
sameday.getPickupPoints();
sameday.createShipment(samedayDelivery_mockup_1.delivery1);
//# sourceMappingURL=manualTest.js.map