# Greenhouse Network & Monitoring

## Table of contents
- [The team](#the-team)
- [The idea](#the-idea)
- [The project](#the-project)
  * [The network](#the-network)
    + [Used network gear](#used-network-gear)
      - [the AP](#the-ap)
      - [The Switch](#the-switch)
      - [The point to multipoint](#the-point-to-multipoint)
      - [Poe](#poe)
      - [The network](#the-network-1)
  * [The monitoring](#the-monitoring)
    + [homeassistant dashboard](#homeassistant-dashboard)
    + [Custom dashboard](#custom-dashboard)
    + [Custom Script](#custom-script)
  * [Planning](#planning)
  * [The Github](#the-github)
  * [The PowerPoint](#the-powerpoint)
  * [The Poster](#the-poster)

## The team
- Belderbos Nigel
- Verhelst Robbe
- Vannevel Aitor
- Vanthorre Elias

## The idea
The idea of this project is to provide the serre, which will be deployed outside in the area of the campus of Vives, with WiFi and a dashboard for monitoring the incoming data from the sensors.

## The project

The project is divided into 2 parts:
- The network
- The monitoring

## Bom list

| Description | Quantity | Price | Already available at school |
|-------------|----------|-------|----------------------------|
| Transmitter LTU Rocket | 1 | [€369](https://eu.store.ui.com/eu/en/collections/uisp-wireless-ltu-5-ghz-basestation/products/ltu-rocket) | Yes |
| LTU Long Range | 6 | [€714](https://eu.store.ui.com/eu/en/collections/uisp-wireless-ltu-5-ghz-client-long-range/products/ltu-lr) | Yes |
| airMAX 5 GHz, 19/20 dBi Sector | 1 | [€128](https://eu.store.ui.com/eu/en/collections/uisp-wireless-antennas-sector/products/am-5g2?variant=am-5g19-120) | Yes |
| Ubiquiti AP Lite | 1 | [€82](https://eu.store.ui.com/eu/en/products/uap-ac-lite) | Yes |
| Cisco Catalyst 2960X-24PS-L | 1 | [€918](https://www.cisco.com/c/en/us/products/collateral/switches/catalyst-2960-x-series-switches/datasheet-c78-729232.html) | Yes |
| **Total Price** | - | **€2211** |

### The network

The network will be deployed in the serre. It will consist of one access point (AP) in the middle, connecting sensors to a monitoring dashboard via WiFi. A switch will connect the network to the Devbit using Ethernet to assign DHCP addresses to the sensors.

#### Used network gear

##### The AP
The AP is a Ubiquiti Unifi AC Lite.

![AP](<foto's/ac lite.png>){height=100px}

##### The Switch
The switch is a Cisco Catalyst 2960X-24PS-L.

![Switch](<foto's/cisco catalyst 2960x.png>){height=100px}

#### Point to Multipoint
1. LTU Rocket

![LTU Rocket](<foto's/LTU rocket.png>){height=100px}

2. LTU Long Range

![LTU Long Range](<foto's/LTU long range.png>){height=100px}

#### Poe
The switch has a maximum PoE wattage of 30 watts. There are different classes of PoE power, as shown below.

![PoE Classes](<foto's/Poe classes.png>){height=100px}

### The monitoring

The monitoring system will use a Home Assistant dashboard hosted on the server in room B303 to track incoming sensor data.

#### HomeAssistant Dashboard
Details about the HomeAssistant dashboard setup.

#### Custom Dashboard
Information about custom dashboard creation.

#### Custom Script
##### How to use
These following scripts are used to make it more user-friendly to add devices to the dashboard.

needs:
- ESP32
- editor for coding the esp (platform.io, arduino IDE, ...)
- sensor.cpp, sensor.h, connection.h, connection.cpp from [releases](https://github.com/vives-project-xp/GreenhouseNetwork-Monitoring/releases/) folder <!-- waarschijnlijk nog veranderen naar een zip -->

in your working file for example with arduino a basic setup wil look like this
```c
#include <Arduino.h>
#include "connection.h"
#include "sensor.h"

#define WIFI_SSID <your-wifi-name> // vervang door wifi naam 
#define WIFI_PASSWORD <your-wifi-password> // vervand door wifi password

HaSensor sensor;
HaConnection connection;

void setup(){

  connection = HaConnection(
    WIFI_SSID,
    WIFI_PASSWORD, 
    80, 
    /*enter true or false here this will enable the com port to get debug reports*/
  );
  connection.setup();

  if (!connection.connected)
    return;

  /* you can uncomment this or even delete, its purpose is fully for debug purposes incase of troubles*/
  // Serial.println("Setup complete");
  // Serial.println("Starting sensor setup");
  
  // Initialize the sensor (e.g., temperature sensor)
  sensor = HaSensor(SensorType::/* your sensor type */); // exmaple Sensor::TEMPERATURE

}

void loop(){
  // your code of processing data

  connection.sendValue(/* your value */);
  connection.sendData(sensor);
  delay(5000);
}
```

## Planning

Sprint 1: (Week 1 to 3)
- Brainstorming and concept ideas
- Testing and small prototypes to create a base concept
- Drafting architecture and a testing checklist
- Final architecture document with test results justifying component choices
- Prepare a bill of materials for initial prototypes

Sprint 2: (Week 4 to 6)
- Create a prototype testing checklist
- Build one or more prototypes for testing various aspects
- Adjust architecture documents and log test results
- Work toward a functioning prototype of the final product

Sprint 3: (Week 7 to 10)
- Transition from prototype to final product or proof of concept
- Test functionality and reliability, making adjustments as needed
- Draft a debugging and testing checklist for the final product

Sprint 4: (Week 11 to 12)
- Thoroughly test the final product using the checklist from Sprint 3
- Document all test results and apply optimizations

Presentation: (Week 13)
- Present the project to the entire program, followed by a Q&A session.

## The Github
[Link to the Github](https://github.com/vives-project-xp/GreenhouseNetwork-Monitoring)

## The PowerPoint
[Link to the PowerPoint]()

## The Poster
[Link to the Poster]()
