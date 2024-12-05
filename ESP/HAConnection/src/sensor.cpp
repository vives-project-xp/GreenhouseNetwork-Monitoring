#include "sensor.h"
#include <map>
#include <ArduinoJson.h> 

HaSensor::HaSensor(){};
HaSensor::HaSensor(String name, SensorType type, int min, int max) : name(name), type(type) {
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
        {SensorType::UV, "index"},
        {SensorType::WATERLEVEL, "cm"},
        {SensorType::BATTERYLEVEL, "%"}
    };
    this->min = min;
    this->max = max;
    auto it = unitMap.find(type);
    if (it != unitMap.end()) {
        this->unit = it->second;
    } else {
        this->unit = "unknown";
    }
}

String HaSensor::toJson() {
    JsonDocument doc;
    doc["name"] = this->name;
    doc["type"] = typeToString(this->type);
    doc["unit"] = this->unit;
    doc["sensor_value"] = this->value;
    doc["min"] = this->min;
    doc["max"] = this->max;
    String json;
    serializeJson(doc, json);
    return json;
}

void HaSensor::setValue(float value) {
    this->value = value;
}


String HaSensor::typeToString(SensorType type) {
    static const std::map<SensorType, String> typeMap = {
        {SensorType::TEMPERATURE, "Temperature"},
        {SensorType::HUMIDITY, "Humidity"},
        {SensorType::LIGHT, "Light"},
        {SensorType::CO2, "CO2"},
        {SensorType::SOIL_MOISTURE, "Soil Moisture"},
        {SensorType::PH, "pH"},
        {SensorType::EC, "EC"},
        {SensorType::PRESSURE, "Pressure"},
        {SensorType::AIRFLOW, "Airflow"},
        {SensorType::UV, "UV"},
        {SensorType::WATERLEVEL, "Water Level"},
        {SensorType::BATTERYLEVEL, "Battery Level"}
    };
    auto it = typeMap.find(type);
    if (it != typeMap.end()) {
        return it->second;
    } else {
        return "Unknown";
    }
}

int HaSensor::getValue() {
    return this->value;
}

int HaSensor::getMax() {
    return this->max;
}