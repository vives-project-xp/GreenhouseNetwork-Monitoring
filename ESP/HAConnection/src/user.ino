#include <Arduino.h>
#include "connection.h"
#include "sensor.h"

HaSensor sensor;
HaConnection connection;

void setup()
{

  Serial.begin(115200);
  connection =  HaConnection("devbit", "Dr@@dloos!", 80, true);
  connection.setup();
  if (!connection.connected)
    return;

  Serial.println("Setup complete");
  Serial.println("Starting sensor setup");
  sensor = HaSensor("temperature", "°C");

}

void loop()
{
  // put your main code here, to run repeatedly:
  float randomNumber = random(0, 450);

  sensor.setValue(randomNumber/10);
  connection.sendData(sensor);
  delay(5000);
}
