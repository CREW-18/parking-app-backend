// Minimal ultrasonic sensor test.
// Use this before testing Wi-Fi/backend code.
//
// ESP32 default:
//   TRIG -> GPIO 5
//   ECHO -> GPIO 18
//
// NodeMCU ESP8266 default:
//   TRIG -> D1
//   ECHO -> D2

#if defined(ESP8266)
const int TRIG_PIN = D1;
const int ECHO_PIN = D2;
#else
const int TRIG_PIN = 5;
const int ECHO_PIN = 18;
#endif

const unsigned long ECHO_TIMEOUT_US = 60000;

void setup() {
  Serial.begin(115200);
  delay(300);

  pinMode(TRIG_PIN, OUTPUT);

#if defined(ESP32)
  pinMode(ECHO_PIN, INPUT_PULLDOWN);
#else
  pinMode(ECHO_PIN, INPUT);
#endif

  digitalWrite(TRIG_PIN, LOW);

  Serial.println();
  Serial.println("=== Ultrasonic Sensor Test ===");
  Serial.print("TRIG pin: ");
  Serial.println(TRIG_PIN);
  Serial.print("ECHO pin: ");
  Serial.println(ECHO_PIN);
}

void loop() {
  int echoBefore = digitalRead(ECHO_PIN);

  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(5);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  unsigned long echoMicros = pulseIn(ECHO_PIN, HIGH, ECHO_TIMEOUT_US);
  int echoAfter = digitalRead(ECHO_PIN);

  Serial.print("echoMicros=");
  Serial.print(echoMicros);
  Serial.print(" echoBefore=");
  Serial.print(echoBefore);
  Serial.print(" echoAfter=");
  Serial.print(echoAfter);

  if (echoMicros > 0) {
    float distanceCm = echoMicros * 0.0343 / 2.0;
    Serial.print(" distanceCm=");
    Serial.print(distanceCm, 1);
  } else {
    Serial.print(" distanceCm=INVALID");
  }

  Serial.println();
  delay(500);
}

