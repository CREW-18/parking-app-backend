# KCT Hardware Integration

This folder contains the ESP32 and NodeMCU ESP8266 code and setup notes for connecting the KCT parking slot sensor to the Park Pulse backend.

Current hardware mapping:

```text
Venue: KCT
Slot: KCT-A1
Hardware ID: KCT-SENSOR-01
Backend endpoint: /api/slots/hardware/KCT-SENSOR-01/availability
```

## Files

```text
hardware/
  README.md
  nodemcu_kct_slot_monitor/
    nodemcu_kct_slot_monitor.ino
  esp32_kct_slot_monitor/
    esp32_kct_slot_monitor.ino
  ultrasonic_sensor_test/
    ultrasonic_sensor_test.ino
```

## Hardware Needed

- NodeMCU ESP8266 or ESP32 development board
- Digital parking sensor, such as an IR obstacle sensor
- Optional distance sensor, such as HC-SR04 ultrasonic, if you want a real range threshold
- Jumper wires
- USB cable for flashing
- Wi-Fi network with internet access

## Wiring

For a common 3-pin IR obstacle sensor:

| Sensor Pin | NodeMCU ESP8266 Pin |
| ---------- | --------- |
| VCC        | 3V3       |
| GND        | GND       |
| OUT        | D2        |

For ESP32, the default sketch pin is GPIO `27`.

The NodeMCU sketch uses `D2` by default. If your sensor is connected to another pin, change `SENSOR_PIN` in the sketch.

## 1 Meter Distance Detection

The digital IR obstacle sketch cannot truly measure "within 1 meter". It only reads `HIGH` or `LOW`; the detection range is adjusted physically using the sensor module potentiometer.

For real distance-based detection, use the ESP32 sketch:

```text
hardware/esp32_kct_slot_monitor/esp32_kct_slot_monitor.ino
```

Default behavior:

```text
distance <= 100 cm  -> sensorBlocked=true  -> slot unavailable
distance > 100 cm   -> sensorBlocked=false -> slot available
```

Default HC-SR04 wiring for NodeMCU ESP8266:

| HC-SR04 Pin | NodeMCU Pin |
| ----------- | ----------- |
| VCC         | VIN / 5V    |
| GND         | GND         |
| TRIG        | D1          |
| ECHO        | D2          |

Default HC-SR04 wiring for ESP32:

| HC-SR04 Pin | ESP32 Pin |
| ----------- | --------- |
| VCC         | 5V/VIN    |
| GND         | GND       |
| TRIG        | GPIO 5    |
| ECHO        | GPIO 18   |

Important: many HC-SR04 modules output 5V on ECHO, while ESP32 and NodeMCU GPIO are 3.3V. Use a voltage divider or level shifter on ECHO before connecting it to the board.

Change the threshold here:

```cpp
const float BLOCKED_DISTANCE_CM = 100.0;
```

Many IR sensors output `LOW` when an object is detected. If your sensor outputs `HIGH` when occupied, change:

```cpp
const int OCCUPIED_SIGNAL = LOW;
```

to:

```cpp
const int OCCUPIED_SIGNAL = HIGH;
```

## Backend Setup

Before flashing the hardware, make sure the backend changes are deployed and the KCT seed data exists.

Locally or on the machine with MongoDB access:

```bash
npm.cmd run seed:locations
npm.cmd run seed:slots
```

The slot seed creates:

```text
slotNumber: KCT-A1
locationName: KCT
hardwareId: KCT-SENSOR-01
isHardwareLinked: true
```

## Arduino IDE Setup

### NodeMCU ESP8266

Use this if your sketch has:

```cpp
#include <ESP8266WiFi.h>
```

1. Install Arduino IDE.
2. Add ESP8266 board support:
   - Open `File > Preferences`
   - Add this to "Additional boards manager URLs":

```text
https://arduino.esp8266.com/stable/package_esp8266com_index.json
```

3. Open `Tools > Board > Boards Manager`.
4. Search `esp8266` and install `esp8266 by ESP8266 Community`.
5. Open `hardware/nodemcu_kct_slot_monitor/nodemcu_kct_slot_monitor.ino`.
6. Select `Tools > Board > ESP8266 Boards > NodeMCU 1.0 (ESP-12E Module)`.
7. Select the correct COM port from `Tools > Port`.

### ESP32

Use this if your sketch has:

```cpp
#include <WiFi.h>
```

1. Install Arduino IDE.
2. Add ESP32 board support:
   - Open `File > Preferences`
   - Add this to "Additional boards manager URLs":

```text
https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json
```

3. Open `Tools > Board > Boards Manager`.
4. Search `esp32` and install `esp32 by Espressif Systems`.
5. Open `hardware/esp32_kct_slot_monitor/esp32_kct_slot_monitor.ino`.
6. Select your ESP32 board from `Tools > Board`.
7. Select the correct COM port from `Tools > Port`.

No extra Arduino libraries are required after installing the correct board package. The sketches use the Wi-Fi and HTTP libraries bundled with the ESP8266/ESP32 board cores.

## Configure Wi-Fi

In your active `.ino` file, replace:

```cpp
const char* WIFI_SSID = "YOUR_WIFI_NAME";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";
```

with your Wi-Fi credentials.

Do not commit real Wi-Fi credentials.

## First Run Checklist

Open Serial Monitor at `115200` baud. After flashing, you should see output like:

```text
=== KCT Smart Parking Slot Monitor ===
Slot: KCT-A1
Hardware ID: KCT-SENSOR-01
[SENSOR] boot sensorBlocked=false isAvailable=true
[WIFI] Connected. IP: 192.168.x.x
[HTTP] POST {"sensorBlocked":false} -> 200
```

After that, the sketch prints a heartbeat every 5 seconds:

```text
[SENSOR] heartbeat sensorBlocked=false isAvailable=true
```

When the sensor changes, you should see:

```text
[SENSOR] raw change rawDigital=0 sensorBlocked=true isAvailable=false
[SENSOR] stable change rawDigital=0 sensorBlocked=true isAvailable=false
[HTTP] POST {"sensorBlocked":true} -> 200
```

If Wi-Fi connects but you do not see any `[HTTP]` line, re-flash the latest sketch from this folder. The current sketches always send one initial state after boot, then send stable changes only.

For ultrasonic sketches, `[HTTP]` is sent only after a valid distance is measured. If you see:

```text
[SENSOR] invalid distanceCm=-1.00 echoMicros=0 echoBefore=0 echoAfter=0
```

the board is not receiving an echo pulse. Check TRIG/ECHO wiring, board pin selection, sensor power, and the ECHO voltage divider/level shifter.

To isolate the sensor from Wi-Fi/backend code, flash:

```text
hardware/ultrasonic_sensor_test/ultrasonic_sensor_test.ino
```

Expected valid output:

```text
echoMicros=2500 echoBefore=0 echoAfter=0 distanceCm=42.9
```

If `echoMicros=0`, the board still cannot see the ultrasonic echo pulse.

If `echoBefore=1`, the ECHO pin is already HIGH before the trigger pulse. ECHO should normally idle LOW. Check that ECHO is on the configured input pin, TRIG/ECHO are not swapped, the voltage divider is wired correctly, and add a 10k pulldown from ECHO input to GND if the line is floating.

## API Used By Hardware

The NodeMCU sketch sends a POST request to:

```http
POST https://parking-app-backend-u019.onrender.com/api/slots/hardware/KCT-SENSOR-01/availability
Content-Type: application/json
```

When occupied:

```json
{
  "sensorBlocked": true
}
```

When empty:

```json
{
  "sensorBlocked": false
}
```

The backend also accepts the older PATCH shape:

```http
PATCH https://parking-app-backend-u019.onrender.com/api/slots/hardware/KCT-SENSOR-01/availability
Content-Type: application/json
```

When occupied:

```json
{
  "isAvailable": false
}
```

When empty:

```json
{
  "isAvailable": true
}
```

## Test Without Hardware

You can test the backend endpoint from PowerShell:

```powershell
Invoke-RestMethod `
  -Method Patch `
  -Uri "https://parking-app-backend-u019.onrender.com/api/slots/hardware/KCT-SENSOR-01/availability" `
  -ContentType "application/json" `
  -Body '{"isAvailable":false}'
```

Then check the KCT slot:

```powershell
Invoke-RestMethod "https://parking-app-backend-u019.onrender.com/api/slots?locationName=KCT&hardwareLinked=true"
```

Set it back to available:

```powershell
Invoke-RestMethod `
  -Method Patch `
  -Uri "https://parking-app-backend-u019.onrender.com/api/slots/hardware/KCT-SENSOR-01/availability" `
  -ContentType "application/json" `
  -Body '{"isAvailable":true}'
```

You can also test the NodeMCU payload shape:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "https://parking-app-backend-u019.onrender.com/api/slots/hardware/KCT-SENSOR-01/availability" `
  -ContentType "application/json" `
  -Body '{"sensorBlocked":true}'
```

## Local Backend Testing

The board cannot call your computer's `localhost`. For local backend testing, use one of these:

- Your computer's LAN IP, for example `http://192.168.1.20:5000`
- A tunnel such as ngrok
- The deployed Render URL

For the simplest demo, use the deployed Render URL after pushing and redeploying the backend.

## Troubleshooting

- Sensor distance/sensitivity is mostly adjusted using the small potentiometer on the IR sensor module. Turn it slowly while watching the sensor module LED and Serial Monitor. Code can debounce noisy readings, but it cannot fully replace the physical sensitivity adjustment.
- If the sketch says `sensorBlocked=true` when nothing is in front of the sensor, look at `rawDigital` in Serial Monitor. If `rawDigital=0` when clear and `rawDigital=1` when blocked, change `BLOCKED_SIGNAL` from `LOW` to `HIGH`. If `rawDigital` never changes, adjust the sensor potentiometer, check wiring, and confirm the signal wire is on the configured pin.
- For an IR obstacle sensor, tune the potentiometer until the module LED is off when the slot is clear and turns on only when your hand/car is close enough.
- If blocked detection works but unblocked detection feels late, lower `STATE_STABLE_MS` slightly in the sketch. If it flickers between states, increase it.
- If HTTP returns `404` with `Not found - /api/slots/hardware/KCT-SENSOR-01/availability`, the deployed backend does not have the hardware route yet. Push the backend changes and redeploy Render, or test against a local/tunneled backend running the latest code.
- If Serial Monitor shows unreadable characters like `rll...` and then the sketch starts again, the board is restarting. A small burst of unreadable boot text is normal on ESP8266, but repeated boot text usually means weak USB power, wrong board selection, or Wi-Fi restarting too often. Use a data USB cable, try another USB port, and make sure NodeMCU sketches are compiled for `NodeMCU 1.0 (ESP-12E Module)`.
- If it keeps printing `Connecting to WiFi` or `Connecting to Wi-Fi SSID`, wait for `WiFi connected. IP: ...`. If that never appears, check that the network is 2.4 GHz, SSID/password are correct, and the board is close to the router or hotspot.
- If compilation fails with `fatal error: WiFi.h: No such file or directory`, Arduino IDE is probably compiling for the wrong board or the ESP32 board package is not installed. Install `esp32 by Espressif Systems` from Boards Manager, then select an ESP32 board such as `ESP32 Dev Module` before compiling.
- If compilation fails with `fatal error: ESP8266WiFi.h: No such file or directory`, install `esp8266 by ESP8266 Community` from Boards Manager and select `NodeMCU 1.0 (ESP-12E Module)`.
- If Serial Monitor shows Wi-Fi disconnected, check SSID/password and make sure the board is on a 2.4 GHz Wi-Fi network.
- If HTTP status is `404`, confirm the backend was redeployed and `KCT-SENSOR-01` exists in MongoDB.
- If HTTP status is `500`, check Render/backend logs.
- If the slot availability is reversed, flip `OCCUPIED_SIGNAL`.
- If updates are noisy, increase `STATE_STABLE_MS` in the sketch.
