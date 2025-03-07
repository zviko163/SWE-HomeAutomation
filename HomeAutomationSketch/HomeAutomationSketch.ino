#include <WiFi.h>
#include <WiFiClient.h>
#include <WebServer.h>
#include <HTTPClient.h>
#include <DHT.h>

// Define sensor pins and types
#define DHTPIN 4
#define DHTTYPE DHT22
#define LDRPIN 34
#define PIRPIN 35
#define BUZZERPIN 32
#define TRIGPIN 12
#define ECHOPIN 14
#define WATERPIN 33 // Water sensor pin for rain detection

DHT dht(DHTPIN, DHTTYPE);

// WiFi credentials
const char* ssid = "YOUR_SSID";
const char* password = "YOUR_PASSWORD";
const char* apSSID = "ESP32_AP";
const char* apPassword = "12345678";

WebServer server(80);

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  // Initialize WiFi as both Station and Access Point
  WiFi.mode(WIFI_AP_STA);
  WiFi.begin(ssid, password);
  WiFi.softAP(apSSID, apPassword);
  
  // Initialize sensor pins and relays
  pinMode(LDRPIN, INPUT);
  pinMode(PIRPIN, INPUT);
  pinMode(BUZZERPIN, OUTPUT);
  pinMode(TRIGPIN, OUTPUT);
  pinMode(ECHOPIN, INPUT);
  pinMode(WATERPIN, INPUT);

  // Define web server routes
  server.on("/", handleRoot);
  server.begin();
}

// Implementing distance measurement to activate motors for door/gate, etc.
float measureDistance() {
  digitalWrite(TRIGPIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIGPIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIGPIN, LOW);
  
  long duration = pulseIn(ECHOPIN, HIGH);
  float distance = duration * 0.034 / 2;
  return distance;
}

void handleRoot() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int lightLevel = analogRead(LDRPIN);
  bool motionDetected = digitalRead(PIRPIN);
  float distance = measureDistance();
  bool isRaining = digitalRead(WATERPIN);
  
  String html = "<!DOCTYPE html><html><head><title>ESP32 Smart Home</title></head><body>";
  html += "<h1>Smart Home Dashboard</h1>";
  html += "<p>Temperature: " + String(temperature) + " C</p>";
  html += "<p>Humidity: " + String(humidity) + " %</p>";
  html += "<p>Light Level: " + String(lightLevel) + "</p>";
  html += "<p>Motion Detected: " + String(motionDetected ? "Yes" : "No") + "</p>";
  html += "<p>Distance: " + String(distance) + " cm</p>";
  html += "<p>Raining: " + String(isRaining ? "Yes" : "No") + "</p>";
  html += "</body></html>";
  
  server.send(200, "text/html", html);
}

void loop() {
  server.handleClient();
  
  // Read sensors
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int lightLevel = analogRead(LDRPIN);
  bool motionDetected = digitalRead(PIRPIN);
  float distance = measureDistance();
  bool isRaining = digitalRead(WATERPIN); // Read water sensor state
  
  // Send data to server/database using HTTP
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin("http://yourserver.com/api/sensordata");
    http.addHeader("Content-Type", "application/json");
    String payload = String("{\"temperature\":") + temperature +
                     String(", \"humidity\":") + humidity +
                     String(", \"lightLevel\":") + lightLevel +
                     String(", \"motion\":") + (motionDetected ? "true" : "false") +
                     String(", \"distance\":") + distance +
                     String(", \"rain\":") + (isRaining ? "true" : "false") +
                     String("}");
    int httpResponseCode = http.POST(payload);
    http.end();
  }
  
  // Automation Logic:
  if (lightLevel < 500) { // Adjust threshold accordingly
    // Activate relay to turn on lights
  }
  
  if (motionDetected && distance < 300) { // Open door if motion is detected and within 3 meters
    // Activate door motor relay to open door
  }
  
  if (motionDetected && distance > 300) { // If motion detected but outside the range, trigger buzzer
    digitalWrite(BUZZERPIN, HIGH);
    delay(1000);
    digitalWrite(BUZZERPIN, LOW);
  }
  
  if (isRaining) { // If rain is detected, sound the buzzer
    digitalWrite(BUZZERPIN, HIGH);
    delay(2000);
    digitalWrite(BUZZERPIN, LOW);
  }
  
  delay(5000); // 5 seconds
}
