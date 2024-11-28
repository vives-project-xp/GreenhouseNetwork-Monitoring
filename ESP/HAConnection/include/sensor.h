#include <Arduino.h>
#ifndef HA_SENSOR_H
#define HA_SENSOR_H


enum class SensorType {
    TEMPERATURE,
    HUMIDITY,
    LIGHT,
    CO2,
    SOIL_MOISTURE,
    PH,
    EC,
    PRESSURE,
    AIRFLOW,
    UV
};


class HaSensor {

private:
    String name;
    SensorType type;
    String unit;
    float value;
    String typeToString(SensorType type);


public:
    HaSensor();
    HaSensor(String name, SensorType type);
    void setValue(float value);
        String toJson();
};


#endif
