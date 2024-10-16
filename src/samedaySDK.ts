import axios, { AxiosError, AxiosInstance } from "axios";

import { endpoints } from "./endpoints";
import {
  AWB,
  AwbPayment,
  CityQueryParams,
  Connection,
  CountyQueryParams,
  DefaultShipmentData,
  GetCitiesResponse,
  GetCountiesResponse,
  PickupPointResponse,
  SamedayClient,
  ServiceType,
  ShipmentData,
} from "./types";
import qs from "qs";

function createSamedayClient(
  connection: Connection = {
    username: process.env.SAMEDAY_USERNAME,
    password: process.env.SAMEDAY_PASSWORD,
    apiUrl: process.env.SAMEDAY_URI,
  },
  defaultShipmentData: DefaultShipmentData = {
    pickupPoint: "261421",
    packageType: 1,
    packageWeight: 1,
    insuredValue: 0,
    thirdPartyPickup: 0,
    currency: "RON",
    service: "7",
  }
): SamedayClient {
  let token: string | null = null;
  let tokenExpiration: number | null = null;
  let pickupPoint: string | null = null;
  const client: AxiosInstance = axios.create({
    baseURL: connection.apiUrl,
    headers: {
      accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  client.interceptors.request.use((config) => {
    return config;
  });

  // if (!connection.password || !connection.username) {
  //   throw new Error("Username and password are required");
  // }

  // if (!token) {
  //   authenticate();
  // }

  async function authenticate(): Promise<string | null> {
    try {
      const response = await client.post(endpoints.AUTH, "remember_me=true", {
        headers: {
          accept: "application/json",
          "X-Auth-Username": connection.username, // Username from environment variables
          "X-Auth-Password": connection.password, // Password from environment variables
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      token = response?.data?.token;
      tokenExpiration = response.data.expire_at_utc; // Store UTC expiration time

      return token;
    } catch (error) {
      console.error("Authentication failed:", error);
      throw new Error("Authentication failed");
    }
  }

  async function ensureAuthenticated(): Promise<string | null> {
    if (!token || isTokenExpired()) {
      return await authenticate();
    }
    return token!;
  }

  function isTokenExpired(): boolean {
    if (!tokenExpiration) {
      return true;
    }

    // Compare current time with the expiration time
    const expirationTime = new Date(tokenExpiration).getTime();
    const currentTime = new Date().getTime();
    return currentTime > expirationTime;
  }

  async function createShipment(
    shipmentData: Partial<ShipmentData>
  ): Promise<AWB> {
    const token = await ensureAuthenticated();

    const {
      packageType,
      packageWeight,
      service,
      cashOnDelivery,
      awbPayment,
      insuredValue,
      thirdPartyPickup,
    } = shipmentData;

    const data: Partial<ShipmentData> = {
      pickupPoint:
        pickupPoint ?? defaultShipmentData.pickupPoint ?? "defaultPickupPoint",
      packageType: packageType ?? defaultShipmentData.packageType ?? 1,
      packageWeight: packageWeight ?? defaultShipmentData.packageWeight ?? 1, // Fallback to 1kg
      service: service ?? defaultShipmentData.service ?? "7",
      awbPayment:
        awbPayment ?? defaultShipmentData.awbPayment ?? AwbPayment.Client,

      insuredValue: insuredValue ?? defaultShipmentData.insuredValue ?? 0,
      thirdPartyPickup:
        thirdPartyPickup ?? defaultShipmentData.thirdPartyPickup ?? 0,
      cashOnDelivery: cashOnDelivery ?? defaultShipmentData.cashOnDelivery ?? 0,
      ...shipmentData,
    };

    try {
      if (connection.sandbox)
        console.log("Request data for create shipment ", data);

      const response = await client.post(
        endpoints.CREATE_AWB, // Replace with correct endpoint for creating a shipment
        qs.stringify(data), // Properly encode the data using qs
        {
          headers: {
            "X-Auth-Token": token,
          },
        }
      );
      if (connection.sandbox)
        console.log("Response data for create shipment : ", response.data);

      return response.data;
    } catch (error) {
      const e = error instanceof AxiosError ? error.response?.data : error;
      const {
        errors: { children },
      } = e;
      console.error("Error creating shipment:", children);
      throw new Error(e);
    }
  }

  async function getServices(): Promise<ServiceType[]> {
    const token = await ensureAuthenticated();

    try {
      const response = await client.get(endpoints.SERVICES, {
        headers: { "X-Auth-Token": token },
      });

      const { data } = response.data;
      if (connection.sandbox) console.log("Response for getServices : ", data);

      return data;
    } catch (error) {
      const e = error instanceof AxiosError ? error.response?.data : error;
      const {
        errors: { children },
      } = e;
      console.error("Error getting services:", children);
      throw new Error(e);
    }
  }

  async function trackShipment(awb: string): Promise<any> {
    const token = await authenticate();

    try {
      const response = await client.get(`${endpoints.TRACK}/${awb}`, {
        headers: {
          "X-Auth-Token": token,
        },
      });
      if (connection.sandbox)
        console.log("Response data for trackshipment : ", response.data);
      return response.data;
    } catch (error) {
      const e = error instanceof AxiosError ? error.response : error;
      console.error(e);
      throw new Error(`Error tracking shipment: ${error}`);
    }
  }

  async function getPickupPoints(
    page = 1,
    perPage = 50
  ): Promise<PickupPointResponse> {
    const token = await ensureAuthenticated();

    try {
      const response = await client.get(endpoints.PICKUP_POINTS, {
        headers: { "X-Auth-Token": token },
        params: {
          page,
          perPage,
        },
      });

      if (connection.sandbox)
        console.log("Response for getPickupPoints: ", response.data);

      return response.data as PickupPointResponse;
    } catch (error) {
      const e = error instanceof AxiosError ? error.response?.data : error;
      console.error("Error fetching pickup points:", e);
      throw new Error(e);
    }
  }

  async function getCities(
    queryParams?: CityQueryParams
  ): Promise<GetCitiesResponse> {
    const token = await ensureAuthenticated();

    const queryString = qs.stringify(queryParams, {
      skipNulls: true,
      addQueryPrefix: true,
    });

    try {
      const response = await client.get(`${endpoints.CITY}${queryString}`, {
        headers: { "X-Auth-Token": token },
      });
      if (connection.sandbox)
        console.log("Response for getCities: ", response.data);

      return response.data as GetCitiesResponse;
    } catch (error) {
      const e = error instanceof AxiosError ? error.response?.data : error;
      console.error("Error fetching cities:", e);
      throw new Error(e);
    }
  }

  async function getCounties(
    queryParams?: CountyQueryParams
  ): Promise<GetCountiesResponse> {
    const token = await ensureAuthenticated();

    const queryString = qs.stringify(queryParams, {
      skipNulls: true,
      addQueryPrefix: true,
    });

    try {
      const response = await client.get(`${endpoints.COUNTY}${queryString}`, {
        headers: { "X-Auth-Token": token },
      });
      if (connection.sandbox)
        console.log("Response for getCounties: ", response.data);
      return response.data as GetCountiesResponse;
    } catch (error) {
      const e = error instanceof AxiosError ? error.response?.data : error;
      console.error("Error fetching counties:", e);
      throw new Error(e);
    }
  }

  function setPickupPoint(newPickupPoint: string): void {
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

export default createSamedayClient;
