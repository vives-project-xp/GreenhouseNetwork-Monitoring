#include <Arduino.h>
#include "connection.h"
#include "sensor.h"
#include "config.h"

HaConnection connection;

HaSensor tempSensor;
HaSensor humSensor;
HaSensor lightSensor;
HaSensor co2Sensor;
HaSensor soilMoistureSensor;
HaSensor phSensor;
HaSensor ecSensor;
HaSensor pressureSensor;
HaSensor airflowSensor;
HaSensor uvSensor;

void setup() {
  Serial.begin(115200);

  connection = HaConnection(WIFI_SSID, WIFI_PASSWORD, "10.10.2.20", 8123, 80, true);

  if (!connection.connected)
    return;

  tempSensor = HaSensor("Temperature", SensorType::TEMPERATURE, 0, 50);
  tempSensor.setValue(20.5);

  humSensor = HaSensor("Humidity", SensorType::HUMIDITY, 0, 100);
  humSensor.setValue(50.5);

  lightSensor = HaSensor("Light Intensity", SensorType::LIGHT, 0, 1000);
  lightSensor.setValue(300.0);

  co2Sensor = HaSensor("CO2 Level", SensorType::CO2, 0, 5000);
  co2Sensor.setValue(2500.0);

  soilMoistureSensor = HaSensor("Soil Moisture", SensorType::SOIL_MOISTURE, 0, 100);
  soilMoistureSensor.setValue(45.0);

  phSensor = HaSensor("pH Level", SensorType::PH, 0, 14);
  phSensor.setValue(6.8);

  ecSensor = HaSensor("Electrical Conductivity", SensorType::EC, 0, 10);
  ecSensor.setValue(6.2);

  pressureSensor = HaSensor("Pressure", SensorType::PRESSURE, 300, 1100);
  pressureSensor.setValue(1013.25);

  airflowSensor = HaSensor("Airflow", SensorType::AIRFLOW, 0, 10);
  airflowSensor.setValue(3);

  uvSensor = HaSensor("UV Index", SensorType::UV, 0, 11);
  uvSensor.setValue(3.0);

  std::vector<HaSensor> sensors = {
    tempSensor, humSensor, lightSensor, co2Sensor,
    soilMoistureSensor, phSensor, ecSensor, 
    pressureSensor, airflowSensor, uvSensor
  };

  connection.sendData("Environment Sensors", sensors);
}

void loop() {
    delay(1000);

tempSensor.setValue(tempSensor.getValue() + random(-15, 16) * 0.5); // Grotere variatie, max ±7.5
humSensor.setValue(humSensor.getValue() + random(-20, 21) * 0.5); // Max ±10.0
lightSensor.setValue(lightSensor.getValue() + random(-500, 501) * 1.0); // Max ±500
co2Sensor.setValue(co2Sensor.getValue() + random(-300, 301) * 1.0); // Max ±300
soilMoistureSensor.setValue(soilMoistureSensor.getValue() + random(-15, 16) * 0.5); // Max ±7.5
phSensor.setValue(phSensor.getValue() + random(-10, 11) * 0.2); // Max ±2.0
ecSensor.setValue(ecSensor.getValue() + random(-10, 11) * 0.2); // Max ±2.0
pressureSensor.setValue(pressureSensor.getValue() + random(-100, 101) * 1.0); // Max ±100
airflowSensor.setValue(airflowSensor.getValue() + random(-5, 6) * 0.5); // Max ±2.5
uvSensor.setValue(uvSensor.getValue() + random(-5, 6) * 0.2); // Max ±1.0



    std::vector<HaSensor> sensors = {
      tempSensor, humSensor, lightSensor, co2Sensor,
      soilMoistureSensor, phSensor, ecSensor, 
      pressureSensor, airflowSensor, uvSensor
    };

    for (auto& sensor : sensors) {
      if (sensor.getValue() == 0) {
        sensor.setValue(random(1, 101)); // Set a random value between 1 and 100
      }
    }

    connection.sendData("Environment Sensors", sensors);
  
}
