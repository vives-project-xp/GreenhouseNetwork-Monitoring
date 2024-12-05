# Greenhouse Network & Monitoring

## Table of contents

- [The team](#the-team)
- [The idea](#the-idea)
- [The project](#the-project)
  - [The network](#the-network)
    - [Used network gear](#used-network-gear)
      - [the AP](#the-ap)
      - [The Switch](#the-switch)
      - [The point to multipoint](#the-point-to-multipoint)
      - [Poe](#poe)
      - [The network](#the-network-1)
  - [The monitoring](#the-monitoring)
    - [homeassistant dashboard](#homeassistant-dashboard)
    - [Custom dashboard](#custom-dashboard)
    - [Custom Script](#custom-script)
  - [Planning](#planning)
  - [The Github](#the-github)
  - [The PowerPoint](#the-powerpoint)
  - [The Poster](#the-poster)

## The team

- Vannevel Aitor (Scrum Master) (Software)
- Belderbos Nigel (Software)
- Verhelst Robbe (Network)
- Vanthorre Elias (Network)

## The idea

The idea of this project is to provide the serre, which will be deployed outside in the area of the campus of Vives, with WiFi and a dashboard for monitoring the incoming data from the sensors.

## The project

The project is divided into 2 parts:

- The network
- The monitoring

## Bom list

| Description                    | Quantity | Price                                                                                                                        | Already available at school |
| ------------------------------ | -------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| Transmitter LTU Rocket         | 1        | [€369](https://eu.store.ui.com/eu/en/collections/uisp-wireless-ltu-5-ghz-basestation/products/ltu-rocket)                    | Yes                         |
| LTU Long Range                 | 6        | [€714](https://eu.store.ui.com/eu/en/collections/uisp-wireless-ltu-5-ghz-client-long-range/products/ltu-lr)                  | Yes                         |
| airMAX 5 GHz, 19/20 dBi Sector | 1        | [€128](https://eu.store.ui.com/eu/en/collections/uisp-wireless-antennas-sector/products/am-5g2?variant=am-5g19-120)          | Yes                         |
| Ubiquiti AP Lite               | 1        | [€82](https://eu.store.ui.com/eu/en/products/uap-ac-lite)                                                                    | Yes                         |
| Cisco Catalyst 2960X-24PS-L    | 1        | [€918](https://www.cisco.com/c/en/us/products/collateral/switches/catalyst-2960-x-series-switches/datasheet-c78-729232.html) | Yes                         |
| **Total Price**                | -        | **€2211**                                                                                                                    |

### The network

The network will be deployed in the serre. It will consist of one access point (AP) in the middle, connecting sensors to a monitoring dashboard via WiFi. A switch will connect the network to the Devbit using Ethernet to assign DHCP addresses to the sensors.

#### Used network gear

##### The AP

The AP is a Ubiquiti Unifi AC Lite.

<img src="foto's/ac lite.png" alt="AP" style="height: 150px;">

##### The Switch

The switch is a Cisco Catalyst 2960X-24PS-L.

<img src="foto's/cisco catalyst 2960x.png" alt="Switch">

#### Point to Multipoint

1. LTU Rocket

<img src="foto's/LTU rocket.png" alt="LTU Rocket" style="height: 150px;">

2. LTU Long Range

<img src="foto's/LTU long range.png" alt="LTU Long Range" style="height: 150px;">

#### Poe

The switch has a maximum PoE wattage of 370 watts. There are different classes of PoE power, as shown below.

<img src="foto's/Poe classes.png" alt="PoE Classes" style="height: 350px;">

the things that will be powerd by PoE are:

- AP Lite
- 2 Axis cameras

the total wattage of the AP Lite and the 2 Axis cameras is +- 45 watts.

#### The network diagram

the network diagram will look like this:

<img src="foto's/devbit to AP.PNG" alt="Network diagram">

the network will be connected to the Devbit using a cable. The Devbit network will assign DHCP addresses to the sensors.
it will go to the roof of the B block where its connected to the LTU Rocket. The LTU Rocket will send the signal wirelessly to the LTU Long Range.
The LTU Long Range will send the signal to the AP Lite.
with the AP Lite, the sensors will be able to connect to the network.

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
- sensor.cpp, sensor.h, connection.h, connection.cpp from [releases](https://github.com/vives-project-xp/GreenhouseNetwork-Monitoring/releases/) folder

Click [here](./ESP/HAConnection/include/README.md) for the installation guide.

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
