#include <Arduino.h>
#include "connection.h"

void setup()
{

  Serial.begin(115200);
  HaConnection connection("devbit", "Dr@@dloos!", "greenhouse2", 80, true);
  connection.setup();
  if (!connection.connected)
    return;
}

void loop()
{
  // put your main code here, to run repeatedly:
}
