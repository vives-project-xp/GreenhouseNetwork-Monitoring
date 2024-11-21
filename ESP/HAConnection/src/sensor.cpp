#include "sensor.h"

HaSensor::HaSensor(): name(), type(), value(0){};
HaSensor::HaSensor(String name, SensorType type) : name(), type(type) {
    this->name = name;
switch (type) {
    case SensorType::TEMPERATURE:
        this->unit = "°C";
        break;
    case SensorType::HUMIDITY:
        this->unit = "%";
        break;
    case SensorType::LIGHT:
        this->unit = "lux";
        break;
    case SensorType::CO2:
        this->unit = "ppm";
        break;
    case SensorType::SOIL_MOISTURE:
        this->unit = "%";
        break;
    case SensorType::PH:
        this->unit = "pH";
        break;
    case SensorType::EC:
        this->unit = "mS/cm";
        break;
    case SensorType::PRESSURE:
        this->unit = "hPa";
        break;
    case SensorType::AIRFLOW:
        this->unit = "m/s";
        break;
    case SensorType::UV:
        this->unit = "index";
        break;
    default:
        this->unit = "unknown";
        break;
}

    Serial.println("Sensor initialized");
    Serial.println("-----------------------");
    Serial.print("Name: ");
    Serial.println(name);
    Serial.print("Type: ");
    Serial.print(typeToString(type));
    Serial.print("\nUnit: ");
    Serial.print(unit);
    Serial.print("\n");
    Serial.println("-----------------------");
}

String HaSensor::toJson() {
    String json = "{";
    json += "\"name\":\"" + this->name + "\",";
    json += "\"type\":\"" + typeToString(this->type) + "\",";
    json += "\"unit\":\"" + this->unit + "\",";
    json += "\"sensor_value\":" + String(this->value);
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

SensorType HaSensor::getType() {
    return this->type;
}

String HaSensor::getUnit() {
    return this->unit;
}

String HaSensor::typeToString(SensorType type) {
    switch (type) {
        case SensorType::TEMPERATURE:
            return "Temperature";
        case SensorType::HUMIDITY:
            return "Humidity";
    }
    return "Unknown";
}