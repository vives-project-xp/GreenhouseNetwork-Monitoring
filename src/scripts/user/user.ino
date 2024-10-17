// network setup
#include <WiFi.h>
#include <ESPmDNS.h>
#define ssid "devbit
#define password  "Dr@@dloos!"
WiFiServer server(80);


void setup() {
  

  Serial.begin(115200);
  WiFi.begin(ssid, password);

  Serial.print("Verbinden met WiFi...");
  do{
    delay(500);
    Serial.print(".");
  }while(WiFi.status() != WL_CONNECTED);
  Serial.print("\n");

  String device_name = "greenhouse";


  // Start mDNS service
  if (!MDNS.begin(device_name)) {
    Serial.println("Error setting up mDNS responder!");
    while (1) {
      delay(1000);
      if (MDNS.begin(device_name)) break;
    }
  }



  Serial.println("mDNS responder gestart");
  Serial.print("device name: ");
  Serial.println(device_name);
  MDNS.addService("_greenhouse", "_tcp", 80);

  server.begin();
  
}

void loop() {

}
