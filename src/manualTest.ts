import dotenv from "dotenv";
import createSamedayClient from "./samedaySDK";
import { delivery1 } from "./mockups/samedayDelivery.mockup";

dotenv.config();

const { SAMEDAY_SANDBOX_API_URL, SAMEDAY_USERNAME, SAMEDAY_PASSWORD } =
  process.env;

const sameday = createSamedayClient({
  username: SAMEDAY_USERNAME as string,
  password: SAMEDAY_PASSWORD as string,
  apiUrl: SAMEDAY_SANDBOX_API_URL as string,
  sandbox: true,
});

sameday.getCounties();
sameday.getCities({ county: "39" });
sameday.getServices();
sameday.getPickupPoints();
sameday.createShipment(delivery1);
