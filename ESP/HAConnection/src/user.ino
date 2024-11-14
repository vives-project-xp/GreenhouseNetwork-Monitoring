#include <Arduino.h>
#include "connection.h"
#include "sensor.h"
#include "config.h"

HaSensor humSensor;
HaSensor tempSensor;
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
  humSensor = HaSensor("Vochtigheid" , SensorType::HUMIDITY);
  tempSensor = HaSensor("Temperatuur" , SensorType::TEMPERATURE);
}

void loop()
{
  float randomNumber = random(0, 450);
  humSensor.setValue(randomNumber/10);
  randomNumber = random(0, 450);
  tempSensor.setValue(randomNumber/10);
  std::vector<HaSensor> sensors = {humSensor, tempSensor};
  connection.sendData("Testing", sensors);
  delay(5000);
}
