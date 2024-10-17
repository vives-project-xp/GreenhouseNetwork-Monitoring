#ifndef HA_CONNECTION_H
#define HA_CONNECTION_H

#include <WiFi.h>
#include <ESPmDNS.h>

class HaConnection {

private:
    String ssid;
    String password;
    String device_name;
    WiFiServer server;
    int port;
    bool output;

public:
    bool connected;
    HaConnection(String ssid, String password, String device_name);
    HaConnection(String ssid, String password, String device_name, int port, bool output);

    void AttemptWifiConnection();
    void StartMDNS();
    void setup();
};


#endif
