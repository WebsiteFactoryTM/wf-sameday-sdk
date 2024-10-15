import axios, { Axios, AxiosError, AxiosInstance } from "axios";
import dotenv from "dotenv";
import { endpoints } from "./endpoints";
import { AWB, AwbPayment, ServiceType, ShipmentData } from "./types";
import qs from "qs";
import { delivery1 } from "./mockups/samedayDelivery.mockup";
dotenv.config();
import createSamedayClient from "./samedaySDK";

const { SAMEDAY_SANDBOX_API_URL, SAMEDAY_USERNAME, SAMEDAY_PASSWORD } =
  process.env;

const sameday = createSamedayClient({
  username: SAMEDAY_USERNAME as string,
  password: SAMEDAY_PASSWORD as string,
  apiUrl: SAMEDAY_SANDBOX_API_URL as string,
  sandbox: true,
});
// sameday.createShipment(delivery1);
sameday.getCounties({
  name: "Timis",
});

sameday.getCities({
  county: "39",
});
