import axios, { AxiosError, AxiosInstance } from "axios";

import { endpoints } from "./endpoints";
import {
  AWB,
  AwbPayment,
  CityQueryParams,
  CountyQueryParams,
  GetCitiesResponse,
  GetCountiesResponse,
  PickupPointResponse,
  ServiceType,
  ShipmentData,
} from "./types";
import qs from "qs";

type Connection = {
  username: string | undefined;
  password: string | undefined;
  apiUrl: string;
  sandbox?: boolean;
};

type DefaultShipmentData = Partial<ShipmentData>;

export interface SamedayClient {
  /**
   * Authenticates the user with the Sameday API.
   *
   * This method sends a POST request to the authentication endpoint using the provided username and password.
   * If authentication is successful, it returns an authentication token and sets the token expiration time.
   *
   * @returns {Promise<string | null>} The authentication token if successful, or `null` if the token is not obtained.
   * @throws {Error} Throws an error if the authentication request fails.
   *
   * Example response:
   * {
   *   "token": "your-authentication-token",
   *   "expire_at_utc": "2024-10-20T10:00:00Z"
   * }
   */
  authenticate: () => Promise<string | null>;
  /**
   * Creates a new shipment with the provided shipment data.
   *
   * This method constructs a shipment request by merging the provided shipment data
   * with default values if necessary. It sends the request to the Sameday API's
   * shipment creation endpoint and returns the response containing the AWB (Air Waybill) number.
   *
   * @param {Partial<ShipmentData>} shipmentData - Data for creating the shipment such as
   *        package type, weight, recipient details, and more.
   * @returns {Promise<AWB | undefined>} - Returns the AWB response if successful,
   *        or undefined if the request fails.
   * @throws {Error} - Throws an error if the request fails.
   */
  createShipment: (
    shipmentData: Partial<ShipmentData>
  ) => Promise<AWB | undefined>;

  /**
   * Retrieves available services from the Sameday API.
   *
   * This method makes an authenticated request to fetch the list of available services
   * for creating shipments, such as express delivery, standard delivery, etc.
   *
   * @returns {Promise<ServiceType[]>} - Returns a list of available services.
   * @throws {Error} - Throws an error if the request fails.
   */
  getServices: () => Promise<ServiceType[]>;

  /**
   * Retrieves available services from the Sameday API.
   *
   * This method makes an authenticated request to fetch the list of available services
   * for creating shipments, such as express delivery, standard delivery, etc.
   *
   * @returns {Promise<ServiceType[]>} - Returns a list of available services.
   * @throws {Error} - Throws an error if the request fails.
   */
  trackShipment: (awb: string) => Promise<any>;
  /**
   * Updates the default pickup point for creating shipments.
   *
   * This method allows updating the default pickup point which will be used
   * in subsequent shipment creation requests.
   *
   * @param {string} newPickupPoint - The ID of the new pickup point.
   */
  setPickupPoint: (newPickupPoint: string) => void;

  /**
   * Retrieves a list of available pickup points.
   *
   * This method sends an authenticated GET request to fetch pickup points with pagination
   * based on the page number and results per page provided.
   *
   * @param {number} [page=1] - The page number to retrieve (defaults to 1).
   * @param {number} [perPage=50] - The number of results per page (defaults to 50).
   * @returns {Promise<PickupPointResponse | void>} - Returns a list of pickup points
   *        or void if the request fails.
   * @throws {Error} - Throws an error if the request fails.
   */
  getPickupPoints: (
    page?: number,
    perPage?: number
  ) => Promise<void | PickupPointResponse>;
  /**
   * Retrieves a list of cities based on query parameters.
   *
   * This method sends an authenticated GET request to fetch cities using the optional query
   * parameters such as name, county, countryCode, page, and countPerPage.
   *
   * @param {CityQueryParams} [queryParams] - Optional query parameters for filtering cities.
   * @returns {Promise<GetCitiesResponse | undefined>} - Returns a list of cities based on
   *        the query parameters or undefined if the request fails.
   * @throws {Error} - Throws an error if the request fails.
   */
  getCities: (
    queryParams?: CityQueryParams
  ) => Promise<void | GetCitiesResponse>;
  /**
   * Retrieves a list of counties based on query parameters.
   *
   * This method sends an authenticated GET request to fetch counties using the optional query
   * parameters such as name, countryCode, page, and countPerPage.
   *
   * @param {CountyQueryParams} [queryParams] - Optional query parameters for filtering counties.
   * @returns {Promise<GetCountiesResponse | undefined>} - Returns a list of counties based on
   *        the query parameters or undefined if the request fails.
   * @throws {Error} - Throws an error if the request fails.
   */
  getCounties: (
    queryParams?: CountyQueryParams
  ) => Promise<void | GetCountiesResponse>;
}

/**
 * Creates a Sameday client with the provided connection details and default shipment data.
 * Handles authentication, shipment creation, service retrieval, shipment tracking, pickup point setting,
 * and fetching of cities and counties.
 *
 * @param connection - The connection details including username, password, API URL, and sandbox mode.
 * @param defaultShipmentData - The default shipment data to be used if not provided in individual shipment requests.
 * @returns The Sameday client object with various methods for interacting with the Sameday API.
 */
function createSamedayClient(
  connection: Connection,
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

  if (!connection.password || !connection.username) {
    throw new Error("Username and password are required");
  }

  if (!token) {
    authenticate();
  }

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
  ): Promise<AWB | undefined> {
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
    }
  }

  async function getServices() {
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
      // const {
      //   errors: { children },
      // } = e;
      throw new Error(`Error tracking shipment: ${error}`);
    }
  }

  async function getPickupPoints(
    page = 1,
    perPage = 50
  ): Promise<PickupPointResponse | void> {
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
    }
  }

  async function getCities(
    queryParams?: CityQueryParams
  ): Promise<GetCitiesResponse | undefined> {
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
    }
  }

  async function getCounties(
    queryParams?: CountyQueryParams
  ): Promise<GetCountiesResponse | undefined> {
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
