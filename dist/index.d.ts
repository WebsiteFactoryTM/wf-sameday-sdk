import { AWB, ServiceType, ShipmentData } from "./types";
type Connection = {
    username: string | undefined;
    password: string | undefined;
    apiUrl: string;
    sandbox?: boolean;
};
type DefaultShipmentData = Partial<ShipmentData>;
declare function SamedaySDK(connection: Connection, defaultShipmentData?: DefaultShipmentData): {
    createShipment: (shipmentData: Partial<ShipmentData>) => Promise<AWB | void>;
    getServices: () => Promise<ServiceType[]>;
    trackShipment: (awb: string) => Promise<any>;
};
export default SamedaySDK;
//# sourceMappingURL=index.d.ts.map