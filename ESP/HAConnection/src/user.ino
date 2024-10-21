#include <Arduino.h>
#include "connection.h"
#include "sensor.h"

HaSensor sensor;
HaConnection connection;


void setup() {
  Serial.begin(115200);

  // Use the credentials from config.h
  connection = HaConnection(WIFI_SSID, WIFI_PASSWORD, 80, true);
  connection.setup();
  
  if (!connection.connected)
    return;

  Serial.println("Setup complete");
  Serial.println("Starting sensor setup");
  
  // Initialize the sensor (e.g., temperature sensor)
  sensor = HaSensor(SensorType::TEMPERATURE);
}

void loop()
{
  // put your main code here, to run repeatedly:
  float randomNumber = random(0, 450);

  sensor.setValue(randomNumber/10);
  connection.sendData(sensor);
  delay(5000);
}
