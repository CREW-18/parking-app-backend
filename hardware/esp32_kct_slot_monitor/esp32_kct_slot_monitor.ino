#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>

// =========================================
// WIFI CONFIG
// =========================================
const char* WIFI_SSID = "HEHE";
const char* WIFI_PASSWORD = "oompaliki";

// =========================================
// API CONFIG
// =========================================
const char* SLOT_ID = "6a0dfc2f018cf0e523cf24a1";

const char* API_URL =
"https://parking-app-backend-u019.onrender.com/api/slots/hardware/KCT-SENSOR-01/availability";

// =========================================
// SENSOR PINS
// =========================================
// ESP8266 PINS
// D1 = GPIO5
// D2 = GPIO4

#define TRIG_PIN D1
#define ECHO_PIN D2

// =========================================
// DISTANCE SETTINGS
// =========================================
const float BLOCKED_DISTANCE_CM = 100.0;

const float MIN_VALID_DISTANCE_CM = 2.0;
const float MAX_VALID_DISTANCE_CM = 500.0;

// =========================================
// TIMING SETTINGS
// =========================================
const unsigned long WIFI_CONNECT_TIMEOUT_MS = 20000;
const unsigned long ECHO_TIMEOUT_US = 60000;

const unsigned long SENSOR_READ_MS = 250;
const unsigned long STATE_STABLE_MS = 500;

const unsigned long SEND_COOLDOWN_MS = 1000;
const unsigned long HEARTBEAT_MS = 2000;
const unsigned long SYNC_HEARTBEAT_MS = 2000;

// =========================================
// FILTER SETTINGS
// =========================================
const int REQUIRED_BLOCKED_READS = 2;
const int REQUIRED_CLEAR_READS = 3;

// =========================================
// SENSOR STATE VARIABLES
// =========================================
bool rawSensorBlocked = false;

bool stableSensorBlocked = false;

bool lastSentSensorBlocked = false;

bool initialSendDone = false;

bool hasValidDistance = false;

bool hasEverHadValidDistance = false;

// =========================================
// SENSOR DATA
// =========================================
float lastDistanceCm = -1.0;

unsigned long lastEchoDuration = 0;

// =========================================
// FILTER COUNTERS
// =========================================
int blockedReadCount = 0;

int clearReadCount = 0;

// =========================================
// TIMERS
// =========================================
unsigned long lastSensorReadAt = 0;

unsigned long rawStateChangedAt = 0;

unsigned long lastSendAt = 0;

unsigned long lastSuccessfulSendAt = 0;

unsigned long lastHeartbeatAt = 0;

// =========================================
// READ DISTANCE
// =========================================
float readDistanceCm() {

  digitalWrite(TRIG_PIN, LOW);

  delayMicroseconds(5);

  digitalWrite(TRIG_PIN, HIGH);

  delayMicroseconds(10);

  digitalWrite(TRIG_PIN, LOW);

  lastEchoDuration =
    pulseIn(ECHO_PIN, HIGH, ECHO_TIMEOUT_US);

  if (lastEchoDuration == 0) {
    return -1.0;
  }

  float distance =
    lastEchoDuration * 0.0343 / 2.0;

  return distance;
}

// =========================================
// VALIDATE DISTANCE
// =========================================
bool isValidDistance(float distanceCm) {

  return distanceCm >= MIN_VALID_DISTANCE_CM &&
         distanceCm <= MAX_VALID_DISTANCE_CM;
}

// =========================================
// SENSOR STATE CHECK
// =========================================
bool readSensorBlocked() {

  lastDistanceCm = readDistanceCm();

  hasValidDistance =
    isValidDistance(lastDistanceCm);

  if (!hasValidDistance) {

    Serial.print("[SENSOR] Invalid Distance: ");

    Serial.println(lastDistanceCm);

    return stableSensorBlocked;
  }

  hasEverHadValidDistance = true;

  return lastDistanceCm <= BLOCKED_DISTANCE_CM;
}

// =========================================
// PRINT SENSOR STATE
// =========================================
void printSensorState(const char* label,
                      bool sensorBlocked) {

  Serial.print("[");
  Serial.print(label);
  Serial.print("] Distance: ");

  Serial.print(lastDistanceCm);

  Serial.print(" cm | Blocked: ");

  Serial.print(sensorBlocked ? "YES" : "NO");

  Serial.print(" | Available: ");

  Serial.println(sensorBlocked ? "NO" : "YES");
}

// =========================================
// CONNECT WIFI
// =========================================
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

  while (WiFi.status() != WL_CONNECTED &&
         millis() - startedAt <
         WIFI_CONNECT_TIMEOUT_MS) {

    Serial.print(".");

    delay(500);
  }

  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {

    Serial.print("[WIFI] Connected! IP: ");

    Serial.println(WiFi.localIP());

  } else {

    Serial.println("[WIFI] Connection Failed");
  }
}

// =========================================
// SEND SLOT STATE
// =========================================
bool sendAvailability(bool sensorBlocked) {

  if (WiFi.status() != WL_CONNECTED) {

    Serial.println("[HTTP] WiFi not connected");

    return false;
  }

  WiFiClientSecure client;

  client.setInsecure();

  HTTPClient http;

  Serial.println("[HTTP] Sending data...");

  if (!http.begin(client, API_URL)) {

    Serial.println("[HTTP] begin() failed");

    return false;
  }

  http.addHeader("Content-Type",
                 "application/json");

  bool isAvailable = !sensorBlocked;

  String payload =
    String("{\"isAvailable\":") +
    (isAvailable ? "true" : "false") +
    "}";

  int statusCode = http.PATCH(payload);

  String response = http.getString();

  Serial.print("[HTTP] Status Code: ");

  Serial.println(statusCode);

  Serial.print("[HTTP] Response: ");

  Serial.println(response);

  http.end();

  lastSendAt = millis();

  return statusCode >= 200 &&
         statusCode < 300;
}

// =========================================
// SETUP
// =========================================
void setup() {

  Serial.begin(115200);

  delay(300);

  pinMode(TRIG_PIN, OUTPUT);

  // FIXED FOR ESP8266
  pinMode(ECHO_PIN, INPUT);

  digitalWrite(TRIG_PIN, LOW);

  rawSensorBlocked = readSensorBlocked();

  stableSensorBlocked = rawSensorBlocked;

  lastSentSensorBlocked =
    !stableSensorBlocked;

  rawStateChangedAt = millis();

  // INITIAL FILTER VALUES
  if (hasValidDistance) {

    if (stableSensorBlocked) {

      blockedReadCount =
        REQUIRED_BLOCKED_READS;

      clearReadCount = 0;

    } else {

      blockedReadCount = 0;

      clearReadCount =
        REQUIRED_CLEAR_READS;
    }
  }

  Serial.println();
  Serial.println("================================");
  Serial.println("KCT SMART PARKING SYSTEM");
  Serial.println("Board: ESP8266");
  Serial.println("================================");

  Serial.print("TRIG PIN: ");

  Serial.println(TRIG_PIN);

  Serial.print("ECHO PIN: ");

  Serial.println(ECHO_PIN);

  printSensorState("BOOT",
                   stableSensorBlocked);

  connectWiFi();
}

// =========================================
// MAIN LOOP
// =========================================
void loop() {

  unsigned long now = millis();

  // =====================================
  // WIFI RECONNECT
  // =====================================
  if (WiFi.status() != WL_CONNECTED) {

    connectWiFi();
  }

  // =====================================
  // SENSOR READ
  // =====================================
  if (now - lastSensorReadAt >=
      SENSOR_READ_MS) {

    lastSensorReadAt = now;

    bool currentRawBlocked =
      readSensorBlocked();

    if (hasValidDistance) {

      // ================================
      // FILTER COUNTS
      // ================================
      if (currentRawBlocked) {

        blockedReadCount++;

        clearReadCount = 0;

      } else {

        clearReadCount++;

        blockedReadCount = 0;
      }

      // ================================
      // RAW CHANGE DETECT
      // ================================
      if (currentRawBlocked !=
          rawSensorBlocked) {

        rawSensorBlocked =
          currentRawBlocked;

        rawStateChangedAt = now;

        printSensorState(
          "RAW CHANGE",
          rawSensorBlocked
        );
      }

      // ================================
      // STABILITY CHECK
      // ================================
      bool enoughMatchingReads =
        currentRawBlocked
        ? blockedReadCount >=
          REQUIRED_BLOCKED_READS
        : clearReadCount >=
          REQUIRED_CLEAR_READS;

      bool stableLongEnough =
        now - rawStateChangedAt >=
        STATE_STABLE_MS;

      // ================================
      // CONFIRMED CHANGE
      // ================================
      if (enoughMatchingReads &&
          stableLongEnough &&
          currentRawBlocked !=
          stableSensorBlocked) {

        stableSensorBlocked =
          currentRawBlocked;

        printSensorState(
          "CONFIRMED CHANGE",
          stableSensorBlocked
        );
      }
    }
  }

  // =====================================
  // SEND CONDITIONS
  // =====================================
  bool shouldSendInitial =
    hasEverHadValidDistance &&
    !initialSendDone;

  bool shouldSendChange =
    hasEverHadValidDistance &&
    stableSensorBlocked !=
    lastSentSensorBlocked;

  bool shouldResendState =
    initialSendDone &&
    hasEverHadValidDistance &&
    now - lastSuccessfulSendAt >=
    SYNC_HEARTBEAT_MS;

  bool sendCooldownPassed =
    now - lastSendAt >=
    SEND_COOLDOWN_MS;

  // =====================================
  // SEND TO SERVER
  // =====================================
  if ((shouldSendInitial ||
       shouldSendChange ||
       shouldResendState) &&
       sendCooldownPassed) {

    if (shouldResendState &&
        !shouldSendInitial &&
        !shouldSendChange) {

      Serial.println(
        "[HTTP] Re-syncing state..."
      );
    }

    if (sendAvailability(
          stableSensorBlocked)) {

      initialSendDone = true;

      lastSentSensorBlocked =
        stableSensorBlocked;

      lastSuccessfulSendAt =
        millis();
    }
  }

  // =====================================
  // HEARTBEAT LOG
  // =====================================
  if (now - lastHeartbeatAt >=
      HEARTBEAT_MS) {

    lastHeartbeatAt = now;

    printSensorState(
      "HEARTBEAT",
      stableSensorBlocked
    );
  }
}
