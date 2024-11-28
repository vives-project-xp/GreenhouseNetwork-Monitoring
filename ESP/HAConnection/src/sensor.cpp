#include "sensor.h"
#include <map>

HaSensor::HaSensor(){};
HaSensor::HaSensor(String name, SensorType type) : name(name), type(type) {
    static const std::map<SensorType, String> unitMap = {
        {SensorType::TEMPERATURE, "°C"},
        {SensorType::HUMIDITY, "%"},
        {SensorType::LIGHT, "lux"},
        {SensorType::CO2, "ppm"},
        {SensorType::SOIL_MOISTURE, "%"},
        {SensorType::PH, "pH"},
        {SensorType::EC, "mS/cm"},
        {SensorType::PRESSURE, "hPa"},
        {SensorType::AIRFLOW, "m/s"},
        {SensorType::UV, "index"}
    };

    auto it = unitMap.find(type);
    if (it != unitMap.end()) {
        this->unit = it->second;
    } else {
        this->unit = "unknown";
    }
}

String HaSensor::toJson() {
    String json = "{";
    json += "\"name\":\"" + this->name + "\",";
    json += "\"type\":\"" + typeToString(this->type) + "\",";
    json += "\"unit\":\"" + this->unit + "\",";
    json += "\"sensor_value\":" + String(this->value);
    json += "}";
    return json;
}

void HaSensor::setValue(float value) {
    this->value = value;
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