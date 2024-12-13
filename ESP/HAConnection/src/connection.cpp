#include "connection.h"
#include <vector>
#include <ArduinoJson.h>

HaConnection::HaConnection() {};
HaConnection::HaConnection(String ssid, String password): HaConnection(ssid, password, "homeassistant.local", 8123, 80, false) {};
HaConnection::HaConnection(String ssid, String password, String HAIp, int HAPort): HaConnection(ssid, password, HAIp, HAPort, 80, false) {};
HaConnection::HaConnection(String ssid, String password, String HAIp, int HAPort, int port, bool output): ssid(ssid), password(password), server(WiFiServer(port)), HAIp(HAIp), HAPort(HAPort), port(port), output(output){this->setup();};

void HaConnection::StartMDNS()
{
    device_name = "greenhouse" + stringIP();
    if(output) Serial.print("starting MDNS");
    do{
        if (output) Serial.print(".");
        delay(250);
    }
    while (!MDNS.begin(device_name.c_str())) ;
    if (output)
    {
        Serial.print("\nMDNS gestart op ");
        Serial.print(device_name);
        Serial.print(".local\n");
    }
    MDNS.addService("_greenhouse", "_tcp", port);
};

void HaConnection::AttemptWifiConnection()
{
    WiFi.begin(ssid.c_str(), password.c_str());
    if (output) Serial.print("Verbinden met WiFi... ");
    do
    {
        if (output) Serial.println(".");
        delay(250);
    } while (WiFi.status() != WL_CONNECTED);
    Serial.println(WiFi.localIP());
};

void HaConnection::setup()
{
    this->AttemptWifiConnection();
    this->StartMDNS();
    this->connected = true;
    this->checkVersion();
};

void HaConnection::sendData(String card_name, const std::vector<HaSensor>& sensors) {
    String json = "{";

    String name = card_name.length() > 0 ? card_name : "Sensor";
    json += "\"card-name\":\"" + name + "\"," + "\"sensors\":[";
    for (HaSensor sensor : sensors) {
    
        json += sensor.toJson() + ",";
    }
    json = json.substring(0, json.length() - 1);
    json += "]}";
    if(output){
        Serial.println("Sending data: ");
        Serial.println(json);
        Serial.println();
    }

    sendHttpPost(json);
}

void HaConnection::sendHttpPost(String json) {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        String url = "http://" + HAIp + ":" + HAPort + "/api/webhook/greenhouse" + stringIP();
        if(output) Serial.println(url);
        http.begin(url);
        http.addHeader("Content-Type", "application/json");
        int httpResponseCode = http.POST(json);
        if(output){
            if (httpResponseCode > 0) {
                String response = http.getString();
                Serial.println("Response: " + response);
            } else Serial.println("Error in sending POST: " + String(httpResponseCode));
        }
        
        http.end();
    } else {
        if(output) Serial.println("WiFi not connected");
        AttemptWifiConnection();
    }
}



String HaConnection::stringIP() {
    // Verkrijg het lokale IP-adres als een string
    String ip = WiFi.localIP().toString();

    ip.replace('.', '_');

    return "_" + ip;  // Voeg aan het begin een underscore toe
}

void HaConnection::checkVersion() {
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        String url = "https://api.github.com/repos/vives-project-xp/GreenhouseNetwork-Monitoring/releases/latest";
        http.begin(url);
        int httpResponseCode = http.GET();
        if (httpResponseCode > 0) {
            String response = http.getString();
            JsonDocument doc;
            deserializeJson(doc, response);
            String latestVersion = doc["tag_name"];
            if (latestVersion != version) {
                Serial.println("New version available: " + latestVersion + " -> https://github.com/vives-project-xp/GreenhouseNetwork-Monitoring/releases");
            }
        }
    }
}
