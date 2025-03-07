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
#define LED_LIGHT 25 // LED for lights
#define RELAY_DOOR 26  // Relay for door motor
#define LEDPIN 2                           // Heartbeat LED pin

DHT dht(DHTPIN, DHTTYPE);

// WiFi credentials
const char* ssid = "Zvikomborero";
const char* password = "12345678";
const char* apSSID = "HomeAutomationAP";
const char* apPassword = "ShammahNemaBaddies";

// Access Point Settings
IPAddress local_ip(192, 168, 2, 1);
IPAddress gateway(192, 168, 2, 1);
IPAddress subnet(255, 255, 255, 0);

WebServer server(80);

// Function Prototypes
void blinkHeartbeat();
float measureDistance();
void handleRoot();
void handleLightOn();
void handleLightOff();
void handleDoorOpen();
void handleDoorClose();
void printSensorReadings();

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
  pinMode(LED_LIGHT, OUTPUT);
  pinMode(RELAY_DOOR, OUTPUT);

  // Ensure Door Relay and Lights are off at startup
  digitalWrite(LED_LIGHT, LOW);
  digitalWrite(RELAY_DOOR, LOW);

  // Define web server routes
  server.on("/", handleRoot);
  server.on("/light/on", handleLightOn);
  server.on("/light/off", handleLightOff);
  server.on("/door/open", handleDoorOpen);
  server.on("/door/close", handleDoorClose);
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

  // Buttons for controlling relays
  html += "<h2>Controls</h2>";
  html += "<p><a href='/light/on'><button>Turn Light ON</button></a> ";
  html += "<a href='/light/off'><button>Turn Light OFF</button></a></p>";
  html += "<p><a href='/door/open'><button>Open Door</button></a> ";
  html += "<a href='/door/close'><button>Close Door</button></a></p>";
  
  html += "</body></html>";

  server.send(200, "text/html", html);
}

// Route handlers
void handleLightOn() {
  digitalWrite(LED_LIGHT, HIGH);
  server.send(200, "text/html", "<p>Light turned ON. <a href='/'>Go Back</a></p>");
}

void handleLightOff() {
  digitalWrite(LED_LIGHT, LOW);
  server.send(200, "text/html", "<p>Light turned OFF. <a href='/'>Go Back</a></p>");
}

void handleDoorOpen() {
  digitalWrite(RELAY_DOOR, HIGH);
  delay(5000); // Keep door open for 5 seconds
  digitalWrite(RELAY_DOOR, LOW);
  server.send(200, "text/html", "<p>Door Opened. <a href='/'>Go Back</a></p>");
}

void handleDoorClose() {
  digitalWrite(RELAY_DOOR, LOW);
  server.send(200, "text/html", "<p>Door Closed. <a href='/'>Go Back</a></p>");
}

void loop() {
  server.handleClient();

  blinkHeartbeat();
  printSensorReadings();
  
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
    http.begin("http://192.168.129.29/swe_project/SWE-HomeAutomation/SensorDataDB/post_sensors_data.php");
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
  if (lightLevel < 500) {
    digitalWrite(LED_LIGHT, HIGH); // Turn on LED for light indication
  } else {
    digitalWrite(LED_LIGHT, LOW); // Turn off LED
  }
  
  if (motionDetected && distance < 300) { // Open door if motion is detected and within 3 meters
    digitalWrite(RELAY_DOOR, HIGH); // Activate door motor relay to open door
    delay(5000); // Keep door open for 5 seconds
    digitalWrite(RELAY_DOOR, LOW);
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

// On-board LED heartbeat
void blinkHeartbeat() {
  static long previousMillis = 0;     // Time tracker for LED toggling
  const long waitInterval = 2000;     // Wait time between cycles (2 seconds)
  long currentMillis = millis();      // Get the current time

  // If 2 seconds have passed, start a new cycle
  if (currentMillis - previousMillis >= waitInterval) {
    previousMillis = currentMillis; // Reset the cycle start time
    digitalWrite(LEDPIN, HIGH);
    delay(1000);
    digitalWrite(LEDPIN, LOW);
    delay(1000);
    digitalWrite(LEDPIN, HIGH);
    delay(1000);
    digitalWrite(LEDPIN, LOW);
  } 
}

// Function to print the sensor reading states
void printSensorReadings() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int lightLevel = analogRead(LDRPIN);
  bool motionDetected = digitalRead(PIRPIN);
  float distance = measureDistance();
  bool isRaining = digitalRead(WATERPIN);

  Serial.println("=== Sensor Readings ===");
  Serial.print("Temperature: "); Serial.print(temperature); Serial.println(" °C");
  Serial.print("Humidity: "); Serial.print(humidity); Serial.println(" %");
  Serial.print("Light Level: "); Serial.println(lightLevel);
  Serial.print("Motion Detected: "); Serial.println(motionDetected ? "Yes" : "No");
  Serial.print("Distance: "); Serial.print(distance); Serial.println(" cm");
  Serial.print("Raining: "); Serial.println(isRaining ? "Yes" : "No");
  Serial.println("=======================");
}
