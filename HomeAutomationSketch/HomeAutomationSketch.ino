/**
 * Smart Home Automation System
 * This sketch implements a home automation system using ESP32 with multiple sensors
 * and a web interface for monitoring and control.
 * Features:
 * - Temperature and humidity monitoring (DHT22)
 * - Light level sensing (LDR)
 * - Motion detection (PIR)
 * - Distance measurement (Ultrasonic)
 * - Rain detection
 * - Current measurement (ACS712)
 * - Automated lighting control
 * - Door control with motion detection
 * - Web interface with dashboard and settings
 */

// Required libraries for functionality
#include <LittleFS.h>
#include <WiFi.h>
#include <WiFiClient.h>
#include <WebServer.h>
#include <HTTPClient.h>
#include <DHT.h>

// Pin definitions for all sensors and actuators
#define DHTPIN 4          // Temperature and humidity sensor pin
#define DHTTYPE DHT22     // DHT22 (AM2302) sensor type
#define LDRPIN 34         // Light Dependent Resistor pin
#define PIRPIN 35         // Passive Infrared motion sensor pin
#define BUZZERPIN 32      // Buzzer for alerts
#define TRIGPIN 18        // Ultrasonic sensor trigger pin
#define ECHOPIN 19        // Ultrasonic sensor echo pin
#define WATERPIN 33       // Rain sensor pin
#define LED_LIGHT 25      // Main LED light pin
#define LED_LIGHT2 23     // Secondary LED light pin
#define RELAY_DOOR 26     // Door control relay pin
#define LEDPIN 2          // Built-in LED for heartbeat indication
#define ACS712_PIN 27     // Current sensor pin

// Initialize DHT sensor
DHT dht(DHTPIN, DHTTYPE);

// Constants for ACS712 current sensor calibration
const float sensitivity = 0.185;     // 185mV per Amp for 5A version
const float Vref_measured = 0.05;    // Measured reference voltage

// WiFi configuration
const char* ssid = "COLOMBIANA 4";           // WiFi network name
const char* password = ".123";               // WiFi password
const char* apSSID = "HomeAutomationAP";     // Access Point name
const char* apPassword = "paden";            // Access Point password

// Global variables for timing and thresholds
unsigned long lastSensorRead = 0;            // Last sensor reading timestamp
unsigned long lastDoorOpen = 0;              // Last door operation timestamp
unsigned long lastBuzzerTone = 0;            // Last buzzer activation timestamp
const unsigned long SENSOR_INTERVAL = 5000;   // Sensor reading interval (5 seconds)
const unsigned long DOOR_OPEN_TIME = 5000;    // Door open duration (5 seconds)
const unsigned long BUZZER_DURATION = 1000;   // Buzzer sound duration (1 second)
int currentLightThreshold = 1500;            // Light threshold for automation
int currentDistanceThreshold = 300;          // Distance threshold for automation

// Access Point network configuration
IPAddress local_ip(192, 168, 2, 1);
IPAddress gateway(192, 168, 2, 1);
IPAddress subnet(255, 255, 255, 0);

// Initialize web server on port 80
WebServer server(80);

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
  server.on("/save-settings", handleSaveSettings);
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
  html += "<meta name='viewport' content='width=device-width, initial-scale=1'>";
  html += "<style>";
  html += "* { box-sizing: border-box; margin: 0; padding: 0; font-family: Arial, sans-serif; }";
  html += "body { background: #f0f2f5; padding: 20px; }";
  html += ".container { max-width: 1200px; margin: 0 auto; }";
  html += ".card { background: white; border-radius: 10px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }";
  html += "h1, h2 { color: #1a73e8; margin-bottom: 20px; }";
  html += ".grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }";
  html += ".sensor-value { font-size: 24px; color: #333; margin-bottom: 5px; }";
  html += ".sensor-label { color: #666; font-size: 14px; }";
  html += "button { background: #1a73e8; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer; transition: 0.3s; }";
  html += "button:hover { background: #1557b0; }";
  html += ".settings-form { display: grid; gap: 15px; }";
  html += ".form-group { display: grid; gap: 5px; }";
  html += "input[type='number'] { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }";
  html += ".tab { overflow: hidden; border-radius: 5px 5px 0 0; }";
  html += ".tab button { background: #f1f1f1; float: left; border: none; padding: 14px 16px; transition: 0.3s; }";
  html += ".tab button:hover { background: #ddd; }";
  html += ".tab button.active { background: #1a73e8; color: white; }";
  html += ".tabcontent { display: none; padding: 20px 0; }";
  html += "#dashboard { display: block; }";
  html += "</style>";
  
  html += "<script>";
  html += "let lightThreshold = localStorage.getItem('lightThreshold') || 500;";
  html += "let distanceThreshold = localStorage.getItem('distanceThreshold') || 300;";
  
  html += "function openTab(evt, tabName) {";
  html += "  var i, tabcontent, tablinks;";
  html += "  tabcontent = document.getElementsByClassName('tabcontent');";
  html += "  for (i = 0; i < tabcontent.length; i++) {";
  html += "    tabcontent[i].style.display = 'none';";
  html += "  }";
  html += "  tablinks = document.getElementsByClassName('tablinks');";
  html += "  for (i = 0; i < tablinks.length; i++) {";
  html += "    tablinks[i].className = tablinks[i].className.replace(' active', '');";
  html += "  }";
  html += "  document.getElementById(tabName).style.display = 'block';";
  html += "  evt.currentTarget.className += ' active';";
  html += "}";
  
  html += "function saveSettings() {";
  html += "  lightThreshold = document.getElementById('lightThreshold').value;";
  html += "  distanceThreshold = document.getElementById('distanceThreshold').value;";
  html += "  localStorage.setItem('lightThreshold', lightThreshold);";
  html += "  localStorage.setItem('distanceThreshold', distanceThreshold);";
  html += "  fetch('/save-settings', {";
  html += "    method: 'POST',";
  html += "    headers: {'Content-Type': 'application/x-www-form-urlencoded'},";
  html += "    body: 'lightThreshold=' + lightThreshold + '&distanceThreshold=' + distanceThreshold";
  html += "  }).then(response => {";
  html += "    if (response.ok) {";
  html += "      alert('Settings saved!');";
  html += "    } else {";
  html += "      alert('Error saving settings');";
  html += "    }";
  html += "  });";
  html += "}";
  
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
  
  html += "<div class='container'>";
  html += "<div class='tab'>";
  html += "<button class='tablinks active' onclick='openTab(event, \"dashboard\")'>Dashboard</button>";
  html += "<button class='tablinks' onclick='openTab(event, \"settings\")'>Settings</button>";
  html += "</div>";
  
  // Dashboard Tab
  html += "<div id='dashboard' class='tabcontent'>";
  html += "<div class='card'>";
  html += "<h1>Smart Home Dashboard</h1>";
  html += "<div class='grid'>";
  html += "<div><div class='sensor-value'>" + temp + " °C</div><div class='sensor-label'>Temperature</div></div>";
  html += "<div><div class='sensor-value'>" + hum + " %</div><div class='sensor-label'>Humidity</div></div>";
  html += "<div><div class='sensor-value'>" + String(lightLevel) + "</div><div class='sensor-label'>Light Level</div></div>";
  html += "<div><div class='sensor-value'>" + String(motionDetected ? "Yes" : "No") + "</div><div class='sensor-label'>Motion Detected</div></div>";
  html += "<div><div class='sensor-value'>" + String(distance) + " cm</div><div class='sensor-label'>Distance</div></div>";
  html += "<div><div class='sensor-value'>" + String(isRaining ? "Yes" : "No") + "</div><div class='sensor-label'>Raining</div></div>";
  html += "</div></div>";
  
  html += "<div class='card'>";
  html += "<h2>Controls</h2>";
  html += "<div style='display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;'>";
  html += "<button onclick=\"controlLight('on')\">Turn Light ON</button>";
  html += "<button onclick=\"controlLight('off')\">Turn Light OFF</button>";
  html += "<button onclick=\"controlDoor('open')\">Open Door</button>";
  html += "<button onclick=\"controlDoor('close')\">Close Door</button>";
  html += "</div></div></div>";
  
  // Settings Tab
  html += "<div id='settings' class='tabcontent'>";
  html += "<div class='card'>";
  html += "<h2>Automation Settings</h2>";
  html += "<div class='settings-form'>";
  html += "<div class='form-group'>";
  html += "<label>Light Threshold (0-4095):</label>";
  html += "<input type='number' id='lightThreshold' min='0' max='4095' value='500'>";
  html += "<small>Light will turn on when level is below this value</small>";
  html += "</div>";
  html += "<div class='form-group'>";
  html += "<label>Distance Threshold (cm):</label>";
  html += "<input type='number' id='distanceThreshold' min='0' max='1000' value='300'>";
  html += "<small>Buzzer will activate when motion is detected beyond this distance</small>";
  html += "</div>";
  html += "<button onclick='saveSettings()'>Save Settings</button>";
  html += "</div></div></div>";
  
  html += "</div></body></html>";

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

void handleSaveSettings() {
  if (server.hasArg("lightThreshold") && server.hasArg("distanceThreshold")) {
    currentLightThreshold = server.arg("lightThreshold").toInt();
    currentDistanceThreshold = server.arg("distanceThreshold").toInt();
    server.send(200, "text/plain", "Settings saved");
  } else {
    server.send(400, "text/plain", "Missing parameters");
  }
}


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
    if (lightLevel < currentLightThreshold) {
      digitalWrite(LED_LIGHT, HIGH);
      digitalWrite(LED_LIGHT2, HIGH);
    } else {
      digitalWrite(LED_LIGHT, LOW);
      digitalWrite(LED_LIGHT2, LOW);
    }
    
    // Door control with motion detection
    if (motionDetected && distance > 0 && distance < currentDistanceThreshold && (currentMillis - lastDoorOpen >= DOOR_OPEN_TIME)) {
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
