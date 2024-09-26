#include <WiFi.h>
#include <ESPmDNS.h>

#define ssid "devbit"
#define password  "Dr@@dloos!"
#define device_name  "greenhouse"

// Maak een eenvoudige webpagina beschikbaar
WiFiServer server(80);

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  do{
    delay(500);
    Serial.println("Verbinden met WiFi...");
  }while(WiFi.status() != WL_CONNECTED);


  // Start mDNS service
  if (!MDNS.begin(device_name)) {
    Serial.println("Error setting up mDNS responder!");
    while (1) {
      delay(1000);
      if (MDNS.begin(device_name)) break;
    }
  }
  
  Serial.println("mDNS responder gestart");
  server.begin();
}

void loop() {
  // Hier zou de verdere functionaliteit van de ESP32 komen
}