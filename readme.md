# Greenhouse Network & monitoring

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
  * [planning](#planning)
  * [the Github](#the-github)
  * [The powerpoint](#the-powerpoint)
  * [The poster](#the-poster)
...

## The team
- Belderbos Nigel
- Verhelst Robbe
- Vannevel Aitor
- Vanthorre Elias

## Het idea
The idea of this project is providing the serre, that will be deployed outside in the area of the campus of vives of WiFi and a dashboard for the incoming data of the sensors.


## The project

The project is divided in 2 parts:
- The network
- The monitoring


## Bom list

| Beschrijving | Hoeveelheid | Prijs | Al aanwezig op school |
|--------------|-------------|-------|-----------------------|
| Transmitter LTU Rocket | 1 | [€369](https://eu.store.ui.com/eu/en/collections/uisp-wireless-ltu-5-ghz-basestation/products/ltu-rocket) | Ja |
| LTU long Range | 6 | [€714](https://eu.store.ui.com/eu/en/collections/uisp-wireless-ltu-5-ghz-client-long-range/products/ltu-lr) | Ja |
| airMAX 5 GHz, 19/20 dBi Sector | 1 | [€128](https://eu.store.ui.com/eu/en/collections/uisp-wireless-antennas-sector/products/am-5g2?variant=am-5g19-120) | Ja |
ubiquiti Ap lite | 1 | [€82] | (https://eu.store.ui.com/eu/en/products/uap-ac-lite)| Ja |
| Cisco catalyst 2960X-24PS-L | 1 | [€918](https://www.cisco.com/c/en/us/products/collateral/switches/catalyst-2960-x-series-switches/datasheet-c78-729232.html) | Ja |
| **Total Price** | - | **€2211** |

### The network

The network is a simple network that will be deployed in the serre. There will be 1 Ap in the middle of the serre. The network will be a WiFi network that will be used to send the data of the sensors to the monitoring dashboard. The network will have a switch in the serre. The switch will be connected to the Devbit by an ethernet. so Devbit can give een DHCP adress to the sensors.

#### Used network gear

##### the AP

The AP is an Ubiquiti Unifi AC lite 

![alt text](<foto's/ac lite.png>)


##### The Switch

the switch is an Cisco catalyst 2960X-24PS-L

![alt text](<foto's/cisco catalyst 2960x.png>)

#### The point to multipoint

1. LTU Rocket

![alt text](<foto's/LTU rocket.png>)

2. LTU Long range

![alt text](<foto's/LTU long range.png>)

#### Poe

The swith has a max poe wattage of 30 watt. there are also classes of poe power, see the picture below

![alt text](<foto's/Poe classes.png>)


#### 



### The monitoring

The monitoring is a dashboard that will be used to monitor the incoming data of the sensors. The dashboard will be Home Assitant that will be hosted on the Server in B303. 

#### homeassistant dashboard

#### Custom dashboard

#### Custom Script





## planning

Sprint 1: (Week 1 tot 3)
- Brainstormen en conceptideeën vormen
- Testen en kleine prototypes maken om tot een basisconcept te komen
- Opstellen van een architectuurdocument en checklist voor testen
- Definitief architectuurdocument met testresultaten die de keuzes van componenten onderbouwen
- Bestellijst maken met benodigdheden voor de eerste prototypes

Sprint 2: (Week 4 tot 6)
- Opstellen van een checklist voor het testen van de prototypes
- Bouwen van één of meerdere prototypes om de verschillende aspecten te testen
- Aanpassen van het architectuurdocument waar nodig en documenteren van testresultaten
- Werken naar een eerste werkend prototype van het uiteindelijke product

Sprint 3: (Week 7 tot 10)
- Overgang van de prototypefase naar het eindresultaat (finaal product of proof of concept)
- Testen van elk aspect van het product op functionaliteit en betrouwbaarheid en aanpassingen maken indien nodig
- Opstellen van een checklist voor het debuggen en testen van het eindresultaat

Sprint 4: (Week 11 tot 12)
- Gedetailleerd testen van het eindresultaat aan de hand van de checklist uit de vorige sprint
- Documenteren van alle testresultaten en optimalisaties doorvoeren waar nodig

Presentatie: (Week 13)
- Het presenteren van het gemaakte project aan de volledige opleiding met een vragen moment op het einde.


## the Github

[Link to the Github](https://github.com/vives-project-xp/GreenhouseNetwork-Monitoring)


## The powerpoint

[Link to the powerpoint] ()


## The poster

[Link to the poster] ()
