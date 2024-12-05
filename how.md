# HA Connection

1. [Dependecies](#dependecies)
2. [Verbinding maken met Home Assistant](#verbinding-maken-met-home-assistant)
3. [Sensor toevoegen](#sensor-toevoegen)
4. [Data verzenden](#data-verzenden)

## Dependecies

Installeer deze bibliotheken om verbinding te kunnen maken met de home assistant.

> ArduinoJson  
>  ESPmDNS  
>  HTTPClient  
>  WiFi

## Verbinding maken met Home Assistant

Er zijn 3 verschillende manieren om verbinding te maken met HomeAssistant:

1. [homeassistant.local](#homeassistantlocal)
2. [Aangepaste url](#aangepaste-url)
3. [Extra instellingen](#extra-instellingen)

### homeassistant.local

Om verbinding te maken met homeassistant.local:8123 moet je enkel een ssid en een wachtwoord invullen. Daarna zal er automatisch verbinding worden gemaakt met homeassistant.local

```c++
#include <Arduino.h>
#include "connection.h"

HaConnection connection;


void setup() {
  Serial.begin(115200);

  connection = HaConnection(WIFI_SSID, WIFI_PASSWORD);

  if (!connection.connected)
    return;
}

void loop(){}

```

### Aangepaste url

Om verbinding te maken met een aangepaste url moet je naast het ssid en een wachtwoord ook het ip/url met de poort invullen. Daarna zal er automatisch verbinding worden gemaakt met de aangepaste url

```c++
#include <Arduino.h>
#include "connection.h"

HaConnection connection;


void setup() {
  Serial.begin(115200);

  connection = HaConnection(WIFI_SSID, WIFI_PASSWORD, "192.168.0.14", 8123);

  if (!connection.connected)
    return;
}

void loop(){}

```

### Extra instellingen

De standaard poort voor mdns is poort 80. Deze kan je aanpassen door de poort mee te geven bij de connectie.
Voor extra logging in de console kan je true meegeven.

```c++
#include <Arduino.h>
#include "connection.h"

HaConnection connection;


void setup() {
  Serial.begin(115200);

  connection = HaConnection(WIFI_SSID, WIFI_PASSWORD, "192.168.0.14", 8123, 80, true);

  if (!connection.connected)
    return;
}

void loop(){}

```

## Sensor toevoegen

Om een sensor toe te voegen aan de home assistant voeg je een nieuwe instantie toe van HASensor.
Bij het aanmaken van de sensor geef je de naam mee die zichtbaar wordt in de home assistant. De 2de paramter is het type sensor.
De verschillende mogelijkheden zijn:

> TEMPERATURE, HUMIDITY, LIGHT, CO2, SOIL_MOISTURE, PH, EC, PRESSURE, AIRFLOW, UV

```c++
#include <Arduino.h>
#include "connection.h"
#include "sensor.h"
#include "config.h"

HaConnection connection;
HaSensor sensor;


void setup() {
  Serial.begin(115200);

  connection = HaConnection(WIFI_SSID, WIFI_PASSWORD);

  if (!connection.connected)
    return;

  sensor = HaSensor("Temperature", SensorType::TEMPERATURE);

}

void loop(){}
```

## Data verzenden

Om data te kunnen verzenden naar de home assistant moet je eerst de waarde toevoegen aan de sensor.

```c++
  sensor.setValue(20.5);
```

Daarna kan je de data doorsturen.

```c++
  connection.sendData("Temperature Card", {sensor});
```

## Voorbeeld

```c++
#include <Arduino.h>
#include "connection.h"
#include "sensor.h"
#include "config.h"

HaConnection connection;
HaSensor sensor;


void setup() {
  Serial.begin(115200);

  connection = HaConnection(WIFI_SSID, WIFI_PASSWORD);


  if (!connection.connected)
    return;

  sensor = HaSensor("Temperature", SensorType::TEMPERATURE);
  sensor.setValue(20.5);
  connection.sendData("Temperature Card", {sensor});
}

void loop(){}
```

