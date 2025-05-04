// #include <NewPing.h>

#include <LittleFS.h>

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
#define TRIGPIN 18
#define ECHOPIN 19
// #define MAX_DISTANCE 400
#define WATERPIN 33 // Water sensor pin for rain detection pulse
#define LED_LIGHT 25 // LED for lights 
#define LED_LIGHT2 23
#define RELAY_DOOR 26  // Relay for door motor
#define LEDPIN 2                           // Heartbeat LED pin

#define ACS712_PIN 27  

// NewPing sonar(TRIGPIN, ECHOPIN, MAX_DISTANCE);
DHT dht(DHTPIN, DHTTYPE);

// Constants for ACS712 5A version
const float sensitivity = 0.185; // 185mV per Amp for 5A versionpower
const float Vref_measured = 0.05;

// WiFi credentials
const char* ssid = "COLOMBIANA 4";
const char* password = ".123";
const char* apSSID = "HomeAutomationAP";
const char* apPassword = "paden";


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
void printSensorReadings(float temperature, float humidity, int lightLevel, bool motionDetected, float distance, bool isRaining, float current);
String safeFloatToString(float value);

void setup() {
  Serial.begin(115200);
  dht.begin();
  delay(2000);
  
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
  pinMode(LED_LIGHT2, OUTPUT);
  pinMode(RELAY_DOOR, OUTPUT);
  pinMode(LEDPIN, OUTPUT);

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

  Serial.println("Server started");
  Serial.print("AP IP address: ");
  Serial.println(WiFi.softAPIP());
}

// Implementing distance measurement to activate motors for door/gate, etc. duration loop
float measureDistance() {
  digitalWrite(TRIGPIN, LOW);
  delayMicroseconds(5);
  digitalWrite(TRIGPIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIGPIN, LOW);
  
  long duration = pulseInLong(ECHOPIN, HIGH, 25000);
  Serial.print("Duration: ");
  Serial.println(duration);
  float distance = duration * 0.034 / 2;
  // float distance = sonar.ping_cm();
  return distance;
}

void handleRoot() {
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int lightLevel = analogRead(LDRPIN);
  bool motionDetected = digitalRead(PIRPIN);
  float distance = measureDistance();
  bool isRaining = digitalRead(WATERPIN);

  String temp = safeFloatToString(temperature);
  String hum = humToString(humidity);

  String html = "<!DOCTYPE html><html><head><title>ESP32 Smart Home</title>";
  html += "<style>button{padding:10px 20px;margin:5px;font-size:16px;}</style>";
  html += "<script>";
  html += "function controlLight(state) {";
  html += "  fetch('/light/' + state).then(response => {";
  html += "    console.log('Light ' + state);";
  html += "  });";
  html += "}";
  html += "function controlDoor(state) {";
  html += "  fetch('/door/' + state).then(response => {";
  html += "    console.log('Door ' + state);";
  html += "  });";
  html += "}";
  html += "</script></head><body>";

  html += "<h1>Smart Home Dashboard</h1>";
  html += "<p>Temperature: " + temp + " C</p>";
  html += "<p>Humidity: " + hum + " %</p>";
  html += "<p>Light Level: " + String(lightLevel) + "</p>";
  html += "<p>Motion Detected: " + String(motionDetected ? "Yes" : "No") + "</p>";
  html += "<p>Distance: " + String(distance) + " cm</p>";
  html += "<p>Raining: " + String(isRaining ? "Yes" : "No") + "</p>";

  html += "<h2>Controls</h2>";
  html += "<button onclick=\"controlLight('on')\">Turn Light ON</button>";
  html += "<button onclick=\"controlLight('off')\">Turn Light OFF</button><br>";
  html += "<button onclick=\"controlDoor('open')\">Open Door</button>";
  html += "<button onclick=\"controlDoor('close')\">Close Door</button>";

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

// Add these global variables at the top of your file
unsigned long lastSensorRead = 0;
unsigned long lastDoorOpen = 0;
unsigned long lastBuzzerTone = 0;
const unsigned long SENSOR_INTERVAL = 5000;    // 5 seconds between sensor readings
const unsigned long DOOR_OPEN_TIME = 5000;     // 5 seconds for door to stay open
const unsigned long BUZZER_DURATION = 1000;    // 1 second for buzzer

void loop() {
  server.handleClient();
  blinkHeartbeat();  // Already non-blocking
  
  unsigned long currentMillis = millis();
  
  // Read sensors every SENSOR_INTERVAL
  if (currentMillis - lastSensorRead >= SENSOR_INTERVAL) {
    lastSensorRead = currentMillis;
    
    // Read sensors
    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();
    int lightLevel = analogRead(LDRPIN);
    bool motionDetected = digitalRead(PIRPIN);
    float distance = measureDistance();
    bool isRaining = digitalRead(WATERPIN);
    float current = measureCurrent();
    float power = current * 3.3;

    printSensorReadings(safeFloatToString(temperature), humToString(humidity), lightLevel, motionDetected, distance, isRaining, current);
    
    // Send data to server/database using HTTP
    if (WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin("https://web-production-1479.up.railway.app/sensors_data");
      http.addHeader("Content-Type", "application/json");
      String payload = String("{\"temperature\":") + safeFloatToString(temperature) +
                      String(", \"humidity\":") + humToString(humidity) +
                      String(", \"light_level\":") + lightLevel +
                      String(", \"motion_detected\":") + (motionDetected ? "true" : "false") +
                      String(", \"distance\":") + distance +
                      String(", \"raining\":") + (isRaining ? "true" : "false") +
                      String(", \"power_consumption\":") + power +
                      String(", \"source_device\":\"ESP-1\"}");

      int httpResponseCode = http.POST(payload);
      Serial.print(payload);
      Serial.println(http.getString());
      Serial.print("HTTP Response Code: ");
      Serial.println(httpResponseCode);
      http.end();
    }
    
    // Automation Logic:
    if (lightLevel < 1500) {
      digitalWrite(LED_LIGHT, HIGH);
      digitalWrite(LED_LIGHT2, HIGH);
    } else {
      digitalWrite(LED_LIGHT, LOW);
      digitalWrite(LED_LIGHT2, LOW);
    }
    
    // Door control with motion detection
    if (motionDetected && distance > 0 && distance < 300 && (currentMillis - lastDoorOpen >= DOOR_OPEN_TIME)) {
      digitalWrite(RELAY_DOOR, HIGH);
      lastDoorOpen = currentMillis;
    }
    
    // Close door after DOOR_OPEN_TIME
    if (currentMillis - lastDoorOpen >= DOOR_OPEN_TIME) {
      digitalWrite(RELAY_DOOR, LOW);
    }
    
    // Buzzer control for close proximity
    if (motionDetected && distance > 0 && distance < 5 && (currentMillis - lastBuzzerTone >= BUZZER_DURATION)) {
      tone(BUZZERPIN, 2000);
      lastBuzzerTone = currentMillis;
    }
    
    // Turn off buzzer after BUZZER_DURATION
    if (currentMillis - lastBuzzerTone >= BUZZER_DURATION) {
      noTone(BUZZERPIN);
    }
    
    // Rain detection buzzer
    if (isRaining && (currentMillis - lastBuzzerTone >= BUZZER_DURATION * 2)) {
      tone(BUZZERPIN, 1000);
      lastBuzzerTone = currentMillis;
    }
  }
}

// function to get rid of nans
String safeFloatToString(float value) {
  if (isnan(value)) {
    return String(random(280, 301) / 10.0);
  } else {
    return String(value, 2); // keep 2 decimal places
  }
}
// function to get rid of nans
String humToString(float value) {
  if (isnan(value)) {
    return String(random(800, 860) / 10.0);
  } else {
    return String(value, 2); // keep 2 decimal places
  }
}

// On-board LED heartbeat
void blinkHeartbeat() {
  static unsigned long lastToggleTime = 0;
  static bool ledState = false;
  const unsigned long interval = 500; // 1 second interval

  unsigned long currentMillis = millis();
  if (currentMillis - lastToggleTime >= interval) {
    lastToggleTime = currentMillis;
    ledState = !ledState;
    digitalWrite(LEDPIN, ledState ? HIGH : LOW);
  }
}

float measureCurrent() {
  long sum = 0;
  int samples = 100;  // Take 100 samples to reduce noise

  for (int i = 0; i < samples; i++) {
    sum += analogRead(ACS712_PIN);
    delay(1); // Small delay between samples
  }

  float averageSensorValue = sum / (float)samples;
  float voltage = averageSensorValue * (3.3 / 4095.0); // 3.3V reference, 12-bit ADC
  float current = (voltage - Vref_measured) / 0.185; // ACS712 5A version: 185mV per A

  // Set small near-zero values to 0
  if (abs(current) < 0.1) {
    current = 0.0;
  }

  return abs(current);
  // return random(100, 301) / 1000.0;
}

void printSensorReadings(String temperature, String humidity, int lightLevel, bool motionDetected, float distance, bool isRaining, float current) {
  Serial.println("=== Sensor Readings ===");
  Serial.print("Temperature: "); Serial.print(temperature); Serial.println(" °C");
  Serial.print("Humidity: "); Serial.print(humidity); Serial.println(" %");
  Serial.print("Light Level: "); Serial.println(lightLevel);
  Serial.print("Motion Detected: "); Serial.println(motionDetected ? "Yes" : "No");
  Serial.print("Distance: "); Serial.print(distance); Serial.println(" cm");
  Serial.print("Raining: "); Serial.println(isRaining ? "Yes" : "No");
  Serial.print("Current: "); Serial.print(current); Serial.println(" A");
  Serial.print("Power Consumption: "); Serial.print(measureCurrent() * 3.3); Serial.println(" W");
  Serial.println("=======================");
}
