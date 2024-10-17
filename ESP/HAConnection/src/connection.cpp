#include "connection.h"

HaConnection::HaConnection(): HaConnection("undefined", "undefined", 80, false) {};
HaConnection::HaConnection(String ssid, String password): HaConnection(ssid, password, 80, false) {};
HaConnection::HaConnection(String ssid, String password, int port, bool output): ssid(ssid), password(password), server(WiFiServer(port)), port(port), output(output){};

void HaConnection::StartMDNS()
{
    device_name = "greenhouse" + stringIP();
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

void HaConnection::sendData(HaSensor sensor){
    Serial.print("Sending data: ");
    Serial.println(sensor.getValue());
    sendHttpPost(sensor);
};

void HaConnection::sendHttpPost(HaSensor sensor) {
    if (WiFi.status() == WL_CONNECTED) {  // Controleer of WiFi verbinding actief is
        HTTPClient http;
        String url = "http://greenhousenetworking.local:8123/api/webhook/greenhouse" + stringIP();
        Serial.println(url);
        http.begin(url);
        http.addHeader("Content-Type", "application/json");  // Zet de juiste headers

        String sensorJson = sensor.toJson();

        int httpResponseCode = http.POST(sensorJson);

        if (httpResponseCode > 0) {
            String response = http.getString();
        } else {
            Serial.println("Error in sending POST: " + String(httpResponseCode));
        }

        // Sluit de HTTP verbinding
        http.end();
    } else {
        Serial.println("WiFi not connected");
    }
}


String HaConnection::stringIP() {
    // Verkrijg het lokale IP-adres als een string
    String ip = WiFi.localIP().toString();

    // Vervang alle punten door underscores
    ip.replace('.', '_');

    return "_" + ip;  // Voeg aan het begin een underscore toe
}
