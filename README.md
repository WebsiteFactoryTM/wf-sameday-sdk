# Sameday SDK

This SDK simplifies the integration with the Sameday API, allowing you to create shipments, track shipments, and retrieve available services. It provides essential functionality to integrate shipping solutions directly into your application with minimal setup.

Work is still in progress

## Features
__**Authenticate:** Automatically handles authentication with the Sameday API, obtaining and managing the token needed for subsequent requests.__
__**Create Shipments:**** Easily create a new shipment using predefined data or custom shipment details.__
__**Track Shipments:** Track an existing shipment by providing the AWB (Air Waybill) number.__
__**Get Services:** Retrieve a list of available services provided by the Sameday delivery system.__
__**Set Pickup Point:** Set or update the default pickup point for shipments.__

## Installation
Install the SDK using npm or yarn:

```bash
npm install sameday-sdk
```

```bash
yarn add sameday-sdk
```


## Usage
### Initialize the Sameday Client
You can initialize the client by providing your connection configuration:

```typescript
import createSamedayClient from 'sameday-sdk';

const sameday = createSamedayClient({
  username: 'your-username',
  password: 'your-password',
  apiUrl: 'https://sameday-api-url.com',
  sandbox: true, // Enable sandbox mode for testing
});

```

### Create a Shipment
To create a shipment, provide the necessary shipment data. Here's an example of how to use the SDK to create a shipment:

```typescript
const shipmentData = {
  pickupPoint: "12345",
  packageType: 1,
  packageWeight: 10,
  service: "7",
  awbPayment: 1,
  cashOnDelivery: 150,
  insuredValue: 200,
  thirdPartyPickup: 0,
  awbRecipient: {
    name: "John Doe",
    phoneNumber: "0700000000",
    personType: 0,
    postalCode: "123456",
    county: "Bucharest",
    city: "Bucharest",
    address: "Main Street 12",
  },
};

sameday.createShipment(shipmentData)
  .then((response) => {
    console.log("Shipment created with AWB:", response.awbNumber);
  })
  .catch((error) => {
    console.error("Error creating shipment:", error);
  });

```

### Get services
You can retrieve a list of available services for shipment:

```typescript
sameday.getServices()
  .then((services) => {
    console.log("Available services:", services);
  })
  .catch((error) => {
    console.error("Error retrieving services:", error);
  });
```

## Configuration
The SDK accepts a configuration object when initializing. The following fields are required:

__**username:** Your Sameday API username.__
__**password:** Your Sameday API password.__
__**apiUrl:** The base URL of the Sameday API.__
__**sandbox(optional):** Set to true to enable sandbox mode for testing.__