#include <Arduino.h>
#include "connection.h"
#include "sensor.h"
#include "config.h"

HaConnection connection;
HaSensor tempSensor;
HaSensor humSensor;


void setup() {
  Serial.begin(115200);

  connection = HaConnection(WIFI_SSID, WIFI_PASSWORD, "10.10.2.20", 8123, 80, true);

  
  if (!connection.connected)
    return;

  tempSensor = HaSensor("Temperature", SensorType::TEMPERATURE);
  tempSensor.setValue(20.5);

  humSensor = HaSensor("Humidity", SensorType::HUMIDITY);
  humSensor.setValue(50.5);

  connection.sendData("Temperature Card", {tempSensor, humSensor});
}

void loop(){}