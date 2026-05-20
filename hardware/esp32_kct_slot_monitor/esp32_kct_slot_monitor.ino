#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>

const char* WIFI_SSID = "YOUR_WIFI_NAME";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

// This MongoDB _id is the seeded KCT-A1 slot.
// It works with the existing deployed endpoint: PATCH /api/slots/:slotId/availability
const char* SLOT_ID = "6a0dfc2f018cf0e523cf24a1";

const char* API_URL =
 "https://parking-app-backend-u019.onrender.com/api/slots/hardware/KCT-SENSOR-01/availability";

// Ultrasonic sensor pins.
// Change these if your TRIG/ECHO wires are connected elsewhere.
const int TRIG_PIN = 5;
const int ECHO_PIN = 18;

// Slot is blocked when the measured object is within this distance.
const float BLOCKED_DISTANCE_CM = 100.0;

const float MIN_VALID_DISTANCE_CM = 2.0;
const float MAX_VALID_DISTANCE_CM = 500.0;

const unsigned long WIFI_CONNECT_TIMEOUT_MS = 20000;
const unsigned long ECHO_TIMEOUT_US = 60000;
const unsigned long SENSOR_READ_MS = 250;
const unsigned long STATE_STABLE_MS = 1000;
const unsigned long SEND_COOLDOWN_MS = 1000;
const unsigned long HEARTBEAT_MS = 2000;

bool rawSensorBlocked = false;
bool stableSensorBlocked = false;
bool lastSentSensorBlocked = false;
bool initialSendDone = false;
bool hasValidDistance = false;

float lastDistanceCm = -1.0;
unsigned long lastEchoDuration = 0;
int lastEchoIdleBefore = LOW;
int lastEchoIdleAfter = LOW;

unsigned long lastSensorReadAt = 0;
unsigned long rawStateChangedAt = 0;
unsigned long lastSendAt = 0;
unsigned long lastHeartbeatAt = 0;

float readDistanceCm() {
  lastEchoIdleBefore = digitalRead(ECHO_PIN);

  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(5);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  lastEchoDuration = pulseIn(ECHO_PIN, HIGH, ECHO_TIMEOUT_US);
  lastEchoIdleAfter = digitalRead(ECHO_PIN);

  if (lastEchoDuration == 0) {
    return -1.0;
  }

  return lastEchoDuration * 0.0343 / 2.0;
}

bool isValidDistance(float distanceCm) {
  return distanceCm >= MIN_VALID_DISTANCE_CM && distanceCm <= MAX_VALID_DISTANCE_CM;
}

bool readSensorBlocked() {
  lastDistanceCm = readDistanceCm();
  hasValidDistance = isValidDistance(lastDistanceCm);

  if (!hasValidDistance) {
    Serial.print("[SENSOR] invalid distanceCm=");
    Serial.print(lastDistanceCm);
    Serial.print(" echoMicros=");
    Serial.print(lastEchoDuration);
    Serial.print(" echoBefore=");
    Serial.print(lastEchoIdleBefore);
    Serial.print(" echoAfter=");
    Serial.println(lastEchoIdleAfter);
    return stableSensorBlocked;
  }

  return lastDistanceCm <= BLOCKED_DISTANCE_CM;
}

void printSensorState(const char* label, bool sensorBlocked) {
  Serial.print("[SENSOR] ");
  Serial.print(label);
  Serial.print(" distanceCm=");
  Serial.print(lastDistanceCm, 1);
  Serial.print(" echoMicros=");
  Serial.print(lastEchoDuration);
  Serial.print(" echoBefore=");
  Serial.print(lastEchoIdleBefore);
  Serial.print(" echoAfter=");
  Serial.print(lastEchoIdleAfter);
  Serial.print(" thresholdCm=");
  Serial.print(BLOCKED_DISTANCE_CM, 1);
  Serial.print(" sensorBlocked=");
  Serial.print(sensorBlocked ? "true" : "false");
  Serial.print(" isAvailable=");
  Serial.println(sensorBlocked ? "false" : "true");
}

void connectWiFi() {
  if (WiFi.status() == WL_CONNECTED) {
    return;
  }

  Serial.println();
  Serial.print("[WIFI] Connecting to ");
  Serial.println(WIFI_SSID);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  unsigned long startedAt = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startedAt < WIFI_CONNECT_TIMEOUT_MS) {
    Serial.print(".");
    delay(500);
  }

  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("[WIFI] Connected. IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("[WIFI] Not connected yet. Will retry from loop.");
  }
}

bool sendAvailability(bool sensorBlocked) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[HTTP] Skipped: WiFi is not connected");
    return false;
  }

  WiFiClientSecure client;
  client.setInsecure();

  HTTPClient http;
  Serial.println("[HTTP] Sending slot state to backend...");

  if (!http.begin(client, API_URL)) {
    Serial.println("[HTTP] begin() failed. Check API_URL.");
    return false;
  }

  http.addHeader("Content-Type", "application/json");

  bool isAvailable = !sensorBlocked;
  String payload = String("{\"isAvailable\":") + (isAvailable ? "true" : "false") + "}";
  int statusCode = http.PATCH(payload);
  String response = http.getString();

  Serial.print("[HTTP] PATCH slotId=");
  Serial.print(SLOT_ID);
  Serial.print(" ");
  Serial.print(payload);
  Serial.print(" -> ");
  Serial.println(statusCode);

  if (response.length() > 0) {
    Serial.println("[HTTP] Response:");
    Serial.println(response);
  }

  http.end();
  lastSendAt = millis();
  return statusCode >= 200 && statusCode < 300;
}

void setup() {
  Serial.begin(115200);
  delay(300);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT_PULLDOWN);
  digitalWrite(TRIG_PIN, LOW);

  rawSensorBlocked = readSensorBlocked();
  stableSensorBlocked = rawSensorBlocked;
  lastSentSensorBlocked = !stableSensorBlocked;
  rawStateChangedAt = millis();

  Serial.println();
  Serial.println("=== KCT Ultrasonic Parking Slot Monitor ===");
  Serial.println("Board: ESP32");
  Serial.println("Slot: KCT-A1");
  Serial.println("Hardware ID: KCT-SENSOR-01");
  Serial.print("TRIG GPIO: ");
  Serial.println(TRIG_PIN);
  Serial.print("ECHO GPIO: ");
  Serial.println(ECHO_PIN);
  printSensorState("boot", stableSensorBlocked);

  connectWiFi();
}

void loop() {
  unsigned long now = millis();

  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  if (now - lastSensorReadAt >= SENSOR_READ_MS) {
    lastSensorReadAt = now;

    bool currentRawBlocked = readSensorBlocked();

    if (currentRawBlocked != rawSensorBlocked) {
      rawSensorBlocked = currentRawBlocked;
      rawStateChangedAt = now;
      printSensorState("raw change", rawSensorBlocked);
    }

    bool stableLongEnough = now - rawStateChangedAt >= STATE_STABLE_MS;
    if (stableLongEnough && rawSensorBlocked != stableSensorBlocked) {
      stableSensorBlocked = rawSensorBlocked;
      printSensorState("stable change", stableSensorBlocked);
    }
  }

  bool shouldSendInitial = hasValidDistance && !initialSendDone;
  bool shouldSendChange = hasValidDistance && stableSensorBlocked != lastSentSensorBlocked;
  bool sendCooldownPassed = now - lastSendAt >= SEND_COOLDOWN_MS;

  if ((shouldSendInitial || shouldSendChange) && sendCooldownPassed) {
    if (sendAvailability(stableSensorBlocked)) {
      initialSendDone = true;
      lastSentSensorBlocked = stableSensorBlocked;
      lastSendAt = now;
    }
  }

  if (now - lastHeartbeatAt >= HEARTBEAT_MS) {
    lastHeartbeatAt = now;
    printSensorState("heartbeat", stableSensorBlocked);
  }
}
