#include "connection.h"


HaConnection::HaConnection(String ssid, String password, String device_name): HaConnection(ssid, password, device_name, 80, false) {};
HaConnection::HaConnection(String ssid, String password, String device_name, int port, bool output): ssid(ssid), password(password), device_name(device_name), server(WiFiServer(port)), port(port), output(output){};

void HaConnection::StartMDNS()
{

    if (!MDNS.begin(device_name.c_str()))
    {
        while (1)
        {
            delay(1000);
            if (MDNS.begin(device_name.c_str()))
                break;
        }
    }
    if (output)
    {
        Serial.print("MDNS gestart op ");
        Serial.print(device_name);
        Serial.print(".local\n");
    }
    MDNS.addService("_greenhouse", "_tcp", port);
};

void HaConnection::AttemptWifiConnection()
{
    WiFi.begin(ssid.c_str(), password.c_str());
    if (output)
        Serial.print("Verbinden met WiFi... ");
    do
    {
        delay(500);
        if (output)
            Serial.print(".");
    } while (WiFi.status() != WL_CONNECTED);
    if (output)
        Serial.print("\n");
};

void HaConnection::setup()
{
    this->AttemptWifiConnection();
    this->StartMDNS();
    this->connected = true;
};
