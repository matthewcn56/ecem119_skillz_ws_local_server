#define WEBSOCKETS_NETWORK_TYPE   NETWORK_WIFININA

#include "defines.h"  
#include <WiFiNINA_Generic.h>
#include <WebSocketsServer_Generic.h>


int keyIndex = 0;                // your network key Index number (needed only for WEP)
const int led = LED_BUILTIN;
int LED_STATE = 0;

int status = WL_IDLE_STATUS;

WebSocketsServer webSocket = WebSocketsServer(81);

void printWiFiStatus()
{
  // print the SSID of the network you're attached to:
  Serial.print(F("SSID: "));

  Serial.println(WiFi.SSID());
  IPAddress ip = WiFi.localIP();

  Serial.print(F("IP Address: "));
  Serial.println(ip);
}

void setup()
{
  //Initialize serial and wait for port to open:
  Serial.begin(115200);

  while (!Serial && millis() < 5000);

  delay(200);

  Serial.print(F("\nStarting AP_SimpleWebServer on "));
  Serial.print(BOARD_NAME);
  Serial.print(F(" with "));
  Serial.println(SHIELD_TYPE);
  Serial.println(WIFI_WEBSERVER_VERSION);

  pinMode(led, OUTPUT);      // set the LED pin mode

  // by default the local IP address of will be 192.168.4.1
  // you can override it with the following:
  // WiFi.config(IPAddress(10, 0, 0, 1));

  // print the network name (SSID);
  Serial.print(F("Creating access point named: "));
  Serial.print(ssid);
  Serial.print(F(" and password: "));
  Serial.println(pass);

  // Create open network. Change this line if you want to create an WEP network:
  // default AP channel = 1
  uint8_t ap_channel = 2;

  status = WiFi.beginAP(ssid, pass, ap_channel);
  if (status != WL_AP_LISTENING) {
    Serial.println(F("Creating access point failed"));

    // don't continue
    while (true);
  }

  webSocket.begin();
  webSocket.onEvent(webSocketEvent);

  // you're connected now, so print out the status
  printWiFiStatus();
}

void loop()
{
  // compare the previous status to the current status
  if (status != WiFi.status()) {
    status = WiFi.status();
    if (status == WL_AP_CONNECTED)
      Serial.println(F("Device connected to AP"));
    else
      Serial.println(F("Device disconnected from AP"));
  }

  // Send serial input to websocket
  digitalWrite(led, LED_STATE);
  webSocket.loop();
  if(Serial.available() > 0) {
    char c[] = {(char)Serial.read()};
    webSocket.broadcastTXT(c, sizeof(c));
  }
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {
  if(type == WStype_TEXT) {
    if(payload[0] == 'C'){
      char mode = payload[1];
      if(mode == '+'){
        LED_STATE=HIGH;
        Serial.println("Turning built-in LED On!");
      }
      else if(mode =='-'){
        LED_STATE=LOW;
        Serial.println("Turning built-in LED Off!");

      }
      else {
        Serial.println("Error reading websocket request");
      }
    }
    else {
      for(int i = 0; i < length; i++)
      Serial.print((char)payload[i]);
    }
    Serial.println();
  }
}
