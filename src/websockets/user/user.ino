#include <Arduino.h>
#include <WebSocketsClient.h>
#include <WiFi.h> // For ESP32, use <ESP8266WiFi.h> for ESP8266

// Replace these with your network credentials
const char* ssid = "Your_SSID";
const char* password = "Your_PASSWORD";

// WebSocket server URL or IP address
const char* websocket_server = "ws://your_websocket_server:port";

// Create a WebSocket client object
WebSocketsClient webSocket;

// Function to handle WebSocket events
void webSocketEvent(WStype_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.printf("[WSc] Disconnected!\n");
      break;
    case WStype_CONNECTED:
      Serial.printf("[WSc] Connected to server\n");
      // Send a message when connected
      webSocket.sendTXT("Hello from ESP!");
      break;
    case WStype_TEXT:
      Serial.printf("[WSc] Received text: %s\n", payload);
      break;
  }
}

void setup() {
  Serial.begin(115200);

  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");

  // Setup WebSocket connection
  webSocket.begin(websocket_server, 80, "/"); // Adjust port and path as needed

  // Define event handler
  webSocket.onEvent(webSocketEvent);

  // Set WebSocket reconnect interval
  webSocket.setReconnectInterval(5000); // Try to reconnect every 5 seconds
}

void loop() {
  // Loop to maintain WebSocket connection
  webSocket.loop();

  // Example: Sending data to WebSocket server every 5 seconds
  static unsigned long lastTime = 0;
  unsigned long currentTime = millis();
  if (currentTime - lastTime >= 5000) {
    lastTime = currentTime;

    // Example data to send
    String sensorData = "Sensor Value: " + String(analogRead(34)); // Replace with actual sensor pin
    webSocket.sendTXT(sensorData);
    Serial.printf("Sent: %s\n", sensorData.c_str());
  }
}
