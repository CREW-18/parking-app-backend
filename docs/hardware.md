# Hardware Integration Documentation

Park Pulse integrates seamlessly with IoT devices to provide real-time, physical parking slot occupancy data to the backend system.

## Hardware Overview

The system is designed around cheap, accessible microcontrollers and sensors:
- **Microcontrollers**: ESP32 or NodeMCU ESP8266 development boards.
- **Sensors**: Digital IR Obstacle Sensors or Ultrasonic Distance Sensors (e.g., HC-SR04).

## Architecture

The IoT flow is completely decentralized. Each parking slot corresponds to a specific physical sensor.
1. The sensor monitors the physical space (e.g., reading a digital HIGH/LOW from an IR sensor, or measuring distance via Ultrasonic).
2. The microcontroller runs a loop, debouncing the signal to prevent flicker.
3. Upon a stable state change (e.g., a car pulls in, blocking the sensor), the microcontroller makes an HTTP POST/PATCH request over Wi-Fi directly to the Park Pulse Backend API.
4. The backend updates the MongoDB `Slot` document (`isAvailable: false`).
5. Web and mobile clients receive the updated slot status.

## Source Code

The code is located in the `hardware/` directory:

- `nodemcu_kct_slot_monitor/`: Arduino sketch optimized for the ESP8266 with a standard digital IR sensor.
- `esp32_kct_slot_monitor/`: Arduino sketch optimized for the ESP32 using an Ultrasonic sensor for precise distance thresholds.
- `ultrasonic_sensor_test/`: A standalone debugging sketch to verify sensor wiring without Wi-Fi overhead.

## API Integration

The hardware communicates with the backend via a specialized endpoint that relies on the `hardwareId` rather than the database `_id`. This allows for static hardware configuration regardless of database resets.

**Endpoint**:
```http
POST /api/slots/hardware/{hardwareId}/availability
Content-Type: application/json
```

**Payload (Occupied)**:
```json
{
  "sensorBlocked": true
}
```

**Payload (Empty)**:
```json
{
  "sensorBlocked": false
}
```

## Setup & Flashing

1. **Prerequisites**: Arduino IDE installed with ESP8266/ESP32 board support packages.
2. **Configuration**: Open the `.ino` sketch and update the following constants:
   - `WIFI_SSID` and `WIFI_PASSWORD`
   - Target backend URL (Render URL or local IP)
   - Ensure `hardwareId` matches a seeded slot in the database (e.g., `KCT-SENSOR-01`).
3. **Wiring**: Connect VCC/GND, and wire the sensor OUT/TRIG/ECHO pins to the defined GPIO pins in the sketch. Use a voltage divider for HC-SR04 ECHO pins on 3.3V boards.
4. **Deploy**: Compile and flash to the board over USB. Open the Serial Monitor at 115200 baud to view boot logs, Wi-Fi connection status, and HTTP request results.