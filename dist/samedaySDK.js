"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importStar(require("axios"));
const endpoints_1 = require("./endpoints");
const types_1 = require("./types");
const qs_1 = __importDefault(require("qs"));
function createSamedayClient(connection, defaultShipmentData = {
    pickupPoint: "261421",
    packageType: 1,
    packageWeight: 1,
    insuredValue: 0,
    thirdPartyPickup: 0,
    currency: "RON",
    service: "7",
}) {
    let token = null;
    let tokenExpiration = null;
    let pickupPoint = null;
    const client = axios_1.default.create({
        baseURL: connection.apiUrl,
        headers: {
            accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    client.interceptors.request.use((config) => {
        return config;
    });
    if (!connection.password || !connection.username) {
        throw new Error("Username and password are required");
    }
    if (!token) {
        authenticate();
    }
    async function authenticate() {
        try {
            const response = await client.post(endpoints_1.endpoints.AUTH, "remember_me=true", {
                headers: {
                    accept: "application/json",
                    "X-Auth-Username": connection.username,
                    "X-Auth-Password": connection.password,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });
            token = response?.data?.token;
            tokenExpiration = response.data.expire_at_utc;
            return token;
        }
        catch (error) {
            console.error("Authentication failed:", error);
            throw new Error("Authentication failed");
        }
    }
    async function ensureAuthenticated() {
        if (!token || isTokenExpired()) {
            return await authenticate();
        }
        return token;
    }
    function isTokenExpired() {
        if (!tokenExpiration) {
            return true;
        }
        const expirationTime = new Date(tokenExpiration).getTime();
        const currentTime = new Date().getTime();
        return currentTime > expirationTime;
    }
    async function createShipment(shipmentData) {
        const token = await ensureAuthenticated();
        const { packageType, packageWeight, service, cashOnDelivery, awbPayment, insuredValue, thirdPartyPickup, } = shipmentData;
        const data = {
            pickupPoint: pickupPoint ?? defaultShipmentData.pickupPoint ?? "defaultPickupPoint",
            packageType: packageType ?? defaultShipmentData.packageType ?? 1,
            packageWeight: packageWeight ?? defaultShipmentData.packageWeight ?? 1,
            service: service ?? defaultShipmentData.service ?? "7",
            awbPayment: awbPayment ?? defaultShipmentData.awbPayment ?? types_1.AwbPayment.Client,
            insuredValue: insuredValue ?? defaultShipmentData.insuredValue ?? 0,
            thirdPartyPickup: thirdPartyPickup ?? defaultShipmentData.thirdPartyPickup ?? 0,
            cashOnDelivery: cashOnDelivery ?? defaultShipmentData.cashOnDelivery ?? 0,
            ...shipmentData,
        };
        try {
            if (connection.sandbox)
                console.log("Request data for create shipment ", data);
            const response = await client.post(endpoints_1.endpoints.CREATE_AWB, qs_1.default.stringify(data), {
                headers: {
                    "X-Auth-Token": token,
                },
            });
            if (connection.sandbox)
                console.log("Response data for create shipment : ", response.data);
            return response.data;
        }
        catch (error) {
            const e = error instanceof axios_1.AxiosError ? error.response?.data : error;
            const { errors: { children }, } = e;
            console.error("Error creating shipment:", children);
        }
    }
    async function getServices() {
        const token = await ensureAuthenticated();
        try {
            const response = await client.get(endpoints_1.endpoints.SERVICES, {
                headers: { "X-Auth-Token": token },
            });
            const { data } = response.data;
            if (connection.sandbox)
                console.log("Response for getServices : ", data);
            return data;
        }
        catch (error) {
            const e = error instanceof axios_1.AxiosError ? error.response?.data : error;
            const { errors: { children }, } = e;
            console.error("Error getting services:", children);
        }
    }
    async function trackShipment(awb) {
        const token = await authenticate();
        try {
            const response = await client.get(`${endpoints_1.endpoints.TRACK}/${awb}`, {
                headers: {
                    "X-Auth-Token": token,
                },
            });
            if (connection.sandbox)
                console.log("Response data for trackshipment : ", response.data);
            return response.data;
        }
        catch (error) {
            const e = error instanceof axios_1.AxiosError ? error.response : error;
            throw new Error(`Error tracking shipment: ${error}`);
        }
    }
    async function getPickupPoints(page = 1, perPage = 50) {
        const token = await ensureAuthenticated();
        try {
            const response = await client.get(endpoints_1.endpoints.PICKUP_POINTS, {
                headers: { "X-Auth-Token": token },
                params: {
                    page,
                    perPage,
                },
            });
            if (connection.sandbox)
                console.log("Response for getPickupPoints: ", response.data);
            return response.data;
        }
        catch (error) {
            const e = error instanceof axios_1.AxiosError ? error.response?.data : error;
            console.error("Error fetching pickup points:", e);
        }
    }
    async function getCities(queryParams) {
        const token = await ensureAuthenticated();
        const queryString = qs_1.default.stringify(queryParams, {
            skipNulls: true,
            addQueryPrefix: true,
        });
        try {
            const response = await client.get(`${endpoints_1.endpoints.CITY}${queryString}`, {
                headers: { "X-Auth-Token": token },
            });
            if (connection.sandbox)
                console.log("Response for getCities: ", response.data);
            return response.data;
        }
        catch (error) {
            const e = error instanceof axios_1.AxiosError ? error.response?.data : error;
            console.error("Error fetching cities:", e);
        }
    }
    async function getCounties(queryParams) {
        const token = await ensureAuthenticated();
        const queryString = qs_1.default.stringify(queryParams, {
            skipNulls: true,
            addQueryPrefix: true,
        });
        try {
            const response = await client.get(`${endpoints_1.endpoints.COUNTY}${queryString}`, {
                headers: { "X-Auth-Token": token },
            });
            if (connection.sandbox)
                console.log("Response for getCounties: ", response.data);
            return response.data;
        }
        catch (error) {
            const e = error instanceof axios_1.AxiosError ? error.response?.data : error;
            console.error("Error fetching counties:", e);
        }
    }
    function setPickupPoint(newPickupPoint) {
        pickupPoint = newPickupPoint;
    }
    return {
        createShipment,
        getServices,
        trackShipment,
        setPickupPoint,
        authenticate,
        getPickupPoints,
        getCities,
        getCounties,
    };
}
exports.default = createSamedayClient;
//# sourceMappingURL=samedaySDK.js.map