#ifndef HA_CONNECTION_H
#define HA_CONNECTION_H

#include <WiFi.h>
#include <ESPmDNS.h>
#include "sensor.h"
#include <HTTPClient.h>

class HaConnection {

private:
    String ssid;
    String password;
    String device_name;
    WiFiServer server;
    int port;
    bool output;
    HaSensor sensor;
    void sendHttpPost(String json);
    String stringIP();

public:
    bool connected;
    HaConnection();
    HaConnection(String ssid, String password);
    HaConnection(String ssid, String password, int port, bool output);

    void AttemptWifiConnection();
    void StartMDNS();
    void setup();
    void sendData(String card_name, const std::vector<HaSensor>& sensors);
};


#endif
