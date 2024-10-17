#include "sensor.h"

HaSensor::HaSensor(): type("undefines"), unit("undefined"), value(0){};
HaSensor::HaSensor(String type, String unit) : type(type), unit(unit) {
    Serial.println("Sensor initialized");
    Serial.println("-----------------------");
    Serial.print("Type: ");
    Serial.print(type);
    Serial.print("\nUnit: ");
    Serial.print(unit);
    Serial.print("\n");
    Serial.println("-----------------------");
}

String HaSensor::toJson() {
    String json = "{";
    json += "\"type\":\"" + this->type + "\",";
    json += "\"unit\":\"" + this->unit + "\",";
    json += "\"value\":" + String(this->value);
    json += "}";
    Serial.println(json);
    return json;
}

void HaSensor::setValue(float value) {
    this->value = value;
}

float HaSensor::getValue() {
    return this->value;
}

String HaSensor::getType() {
    return this->type;
}

String HaSensor::getUnit() {
    return this->unit;
}
