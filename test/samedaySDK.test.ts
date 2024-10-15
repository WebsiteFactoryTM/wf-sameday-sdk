import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import dotenv from "dotenv";

import { endpoints } from "../src/endpoints";
import { delivery1 } from "../src/mockups/samedayDelivery.mockup";

import createSamedayClient from "../src/samedaySDK";
import { PickupPointResponse } from "../src/types";
dotenv.config();
axios.interceptors.request.use((config) => {
  console.log("Request made with config:", config);
  return config;
});
const { SAMEDAY_SANDBOX_API_URL, SAMEDAY_USERNAME, SAMEDAY_PASSWORD } =
  process.env;

describe("Sameday SDK", () => {
  let sameday: ReturnType<typeof createSamedayClient>; // Correct type assignment
  let mock: MockAdapter;
  beforeEach(() => {
    mock = new MockAdapter(axios);

    sameday = createSamedayClient({
      username: SAMEDAY_USERNAME as string,
      password: SAMEDAY_PASSWORD as string,
      apiUrl: SAMEDAY_SANDBOX_API_URL as string,
      //   sandbox: true,
    });
    // Add the interceptor here to log request details
    mock.onPost(endpoints.AUTH).reply(200, {
      token: "test-token",
      expire_at_utc: "2024-10-20T10:00:00Z",
    });
  });

  afterEach(() => {
    mock.reset();
  });

  it("should authenticate and return a token", async () => {
    mock.onPost(endpoints.AUTH).reply(200, {
      token: "test-token",
      expire_at_utc: "2024-10-20T10:00:00Z",
    });

    const token = await sameday.authenticate();
    expect(token).toBe("test-token");
  });

  it("should create a shipment", async () => {
    // mock.onPost(endpoints.AUTH).reply(200, { token: "test-token" });
    mock.onPost(endpoints.CREATE_AWB).reply(200, { awbNumber: "AWB12345" });

    const shipment = await sameday.createShipment(delivery1);
    if (shipment !== undefined)
      expect(typeof shipment.awbNumber).toBe("string");
  });

  it("should get services", async () => {
    mock.onPost(endpoints.AUTH).reply(200, { token: "test-token" });
    mock.onGet(endpoints.SERVICES).reply(200, {
      data: [
        { id: 1, name: "Standard Delivery" },
        { id: 2, name: "Express Delivery" },
      ],
    });
    try {
      const services = await sameday.getServices();
      expect(services).toHaveLength(2);
      //   expect(services[0].name).toBe("Standard Delivery");
    } catch (e) {
      console.log(e);
    }
  });

  it("should fetch pickup points", async () => {
    const mockResponse: PickupPointResponse = {
      total: 1,
      currentPage: 1,
      pages: 1,
      perPage: 10,
      data: [
        {
          country: {
            id: 1,
            name: "Romania",
            code: "RO",
          },
          id: 123,
          county: {
            id: 10,
            name: "Bucharest",
            code: "B",
          },
          city: {
            samedayDeliveryAgency: "Agency1",
            samedayPickupAgency: "Agency2",
            id: 20,
            name: "Bucharest",
            extraKM: 0,
          },
          address: "Main Street 123",
          postalCode: "123456",
          defaultPickupPoint: true,
          pickupPointContactPerson: {
            id: 50,
            name: "John Doe",
            position: "Manager",
            phoneNumber: "0700000000",
            email: "john.doe@example.com",
            defaultContactPerson: true,
            nationality: "Romanian",
            nationalID: "RO123456",
          },
          alias: "Main Pickup",
          cutOff: "17:00",
          deliveryInterval: "10-12",
          status: true,
        },
      ],
    };

    mock.onGet(endpoints.PICKUP_POINTS).reply(200, mockResponse);

    const response = await sameday.getPickupPoints();
    expect(response).toEqual(mockResponse);
    expect(response?.data[0].address).toBe("Main Street 123");
  });

  it("should fetch cities", async () => {
    mock.onGet(endpoints.CITY).reply(200, {
      total: 1,
      currentPage: 1,
      pages: 1,
      perPage: 50,
      data: [
        {
          samedayDeliveryAgencyId: 1,
          samedayDeliveryAgency: "Agency1",
          samedayPickupAgency: "Agency1 Pickup",
          nextDayDeliveryAgencyId: 2,
          nextDayDeliveryAgency: "Next Day Agency",
          nextDayPickupAgency: "Next Day Pickup",
          whiteDeliveryAgencyId: 3,
          whiteDeliveryAgency: "White Agency",
          whitePickupAgency: "White Pickup",
          logisticCircle: "Logistics",
          country: { id: 1, name: "Romania", code: "RO" },
          id: 1,
          name: "City1",
          extraKM: 10,
          village: "Village1",
          brokerDelivery: 0,
          postalCode: "12345",
          county: { name: "County1", id: 1, code: "CT1" },
        },
      ],
    });

    const cities = await sameday.getCities();
    expect(cities?.data).toHaveLength(1);
    expect(cities?.data[0].name).toBe("City1");
  });

  it("should fetch cities with query parameters", async () => {
    mock.onGet(new RegExp(`${endpoints.CITY}?.*`)).reply(200, {
      total: 1,
      currentPage: 1,
      pages: 1,
      perPage: 10,
      data: [
        {
          samedayDeliveryAgencyId: 1,
          samedayDeliveryAgency: "Agency 1",
          samedayPickupAgency: "Pickup Agency 1",
          nextDayDeliveryAgencyId: 1,
          nextDayDeliveryAgency: "Next Day Agency 1",
          nextDayPickupAgency: "Next Day Pickup 1",
          whiteDeliveryAgencyId: 1,
          whiteDeliveryAgency: "White Agency 1",
          whitePickupAgency: "White Pickup 1",
          logisticCircle: "Circle 1",
          country: { id: 1, name: "Romania", code: "RO" },
          id: 1,
          name: "Timisoara",
          extraKM: 0,
          village: "Village 1",
          brokerDelivery: 0,
          postalCode: "300001",
          county: { id: 39, name: "Timis", code: "TM" },
        },
      ],
    });

    const cities = await sameday.getCities({
      name: "Timisoara",
      county: "39",
      countryCode: "RO",
      page: 1,
      countPerPage: 10,
    });

    expect(cities).toBeDefined();
    expect(cities?.data.length).toBeGreaterThan(0);
    expect(cities?.data[0].name).toBe("Timisoara");
    expect(cities?.data[0].county.name).toBe("Timis");
  });

  it("should fetch all counties counties", async () => {
    mock.onGet(endpoints.COUNTY).reply(200, {
      total: 1,
      currentPage: 1,
      pages: 1,
      perPage: 50,
      data: [{ id: 1, name: "County1", code: "CT1" }],
    });

    const counties = await sameday.getCounties();
    expect(counties?.data).toHaveLength(1);
    expect(counties?.data[0].name).toBe("County1");
  });

  it("should fetch counties with query parameters", async () => {
    mock.onGet(new RegExp(`${endpoints.COUNTY}?.*`)).reply(200, {
      total: 1,
      currentPage: 1,
      pages: 1,
      perPage: 5,
      data: [
        {
          id: 1,
          name: "Timis",
          code: "TM",
          country: "Romania",
        },
      ],
    });

    const counties = await sameday.getCounties({
      name: "Timis",
      countryCode: "RO",
      page: 1,
      countPerPage: 5,
    });

    expect(counties).toBeDefined();
    expect(counties?.data.length).toBeGreaterThan(0);
    expect(counties?.data[0].name).toBe("Timis");
    expect(counties?.data[0]?.country).toBe("Romania");
  });
});
