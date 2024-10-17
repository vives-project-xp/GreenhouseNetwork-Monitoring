#include <Arduino.h>
#ifndef HA_SENSOR_H
#define HA_SENSOR_H


enum class SensorType {
    TEMPERATURE,
    HUMIDITY,
};

class HaSensor {

private:
    SensorType type;
    String unit;
    float value;


public:
    HaSensor();
    HaSensor(SensorType type);
    void setValue(float value);
    float getValue();
    SensorType getType();
    String getUnit();
    String toJson();
    String typeToString(SensorType type);
};


#endif
