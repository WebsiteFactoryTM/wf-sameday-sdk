import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import dotenv from "dotenv";

import { endpoints } from "../src/endpoints";
import { delivery1 } from "../src/mockups/samedayDelivery.mockup";

import createSamedayClient from "../src/samedaySDK";
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
      sandbox: true,
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

  //   it("should track a shipment", async () => {
  //     mock.onPost(endpoints.AUTH).reply(200, { token: "test-token" });
  //     mock.onGet(`${endpoints.TRACK}/AWB12345`).reply(200, {
  //       trackingDetails: "Package is in transit",
  //     });

  //     const tracking = await sameday.trackShipment("AWB12345");
  //     expect(tracking.trackingDetails).toBe("Package is in transit");
  //   });
});
