#include <Arduino.h>
#include "connection.h"
#include "sensor.h"
#include "config.h"

HaConnection connection;
HaSensor sensor;


void setup() {
  Serial.begin(115200);

  connection = HaConnection(WIFI_SSID, WIFI_PASSWORD, "10.10.2.20", 8123, 80, true);

  
  if (!connection.connected)
    return;

  sensor = HaSensor("Temperature", SensorType::TEMPERATURE);
  sensor.setValue(20.5);
  connection.sendData("Temperature Card", {sensor});
}

void loop(){}