#include <Arduino.h>
#ifndef HA_SENSOR_H
#define HA_SENSOR_H


enum class SensorType {
    TEMPERATURE,
    HUMIDITY,
};

class HaSensor {

private:
    String name;
    SensorType type;
    String unit;
    float value;


public:
    HaSensor();
    HaSensor(String name, SensorType type);
    void setValue(float value);
    float getValue();
    String getName();
    SensorType getType();
    String getUnit();
    String toJson();
    String typeToString(SensorType type);
};


#endif
