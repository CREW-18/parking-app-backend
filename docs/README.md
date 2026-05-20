# Park Pulse System Documentation

Welcome to the **Park Pulse** documentation! This guide provides a comprehensive overview of the entire system architecture, designed so that new contributors can quickly understand how everything works together.

## System Overview

Park Pulse (also referred to as Slotify) is a comprehensive Smart Parking solution. It encompasses a full-stack web and mobile ecosystem integrated with physical hardware (IoT sensors) and an AI-driven heatmap analytics service.

### The Ecosystem Components

1. **Backend API (`/src`)**: A robust REST API built with Node.js, Express, and MongoDB. It manages data, handles user authentication, tracks parking slots, processes bookings, and communicates with hardware sensors.
2. **Web Frontend (`/frontend`)**: The primary user interface. A modern, responsive web application built with React, Vite, and Tailwind CSS.
3. **Legacy Mobile App (`/park-pulse-frontend`)**: An older version of the mobile application built with React Native and Expo, kept for reference and backward compatibility.
4. **Hardware Integration (`/hardware`)**: Code and wiring guides for ESP32 and NodeMCU microcontrollers that use sensors (IR/Ultrasonic) to detect real-time parking slot occupancy.
5. **AI Service (`/ai_service.py`)**: A Python-based microservice (Flask + Pandas) that processes parking history to generate hourly occupancy heatmaps.
6. **Database Scripts (`/scripts`)**: Utility scripts for seeding initial mock data (locations, slots) into the MongoDB database.

## Architecture Diagram

```text
+-------------------+       HTTP / REST       +-----------------------+
|                   | <---------------------> |                       |
|   Web Frontend    |                         |    Backend API        |
|  (React/Vite)     |                         |  (Node.js/Express)    |
|                   |                         |                       |
+-------------------+                         +-------+-------+-------+
                                                      |       |
+-------------------+       HTTP / REST               |       |
|                   | <-------------------------------+       |
| Legacy Mobile App |                                         |
|  (Expo/React NT)  |                                         |
|                   |                                         |
+-------------------+                                         |
                                                              | HTTP POST/PATCH
+-------------------+       HTTP / REST       +---------------+-------+
|                   | <---------------------> |                       |
|    AI Service     |                         |  Hardware Sensors     |
|  (Python/Flask)   |                         |   (ESP32/NodeMCU)     |
|                   |                         |                       |
+-------------------+                         +-----------------------+
```

## Getting Started

To explore the details of each module, check out the specific documentation files in this folder:

- [Backend Documentation](backend.md)
- [Web Frontend Documentation](frontend.md)
- [Mobile App Documentation](mobile.md)
- [Hardware Documentation](hardware.md)
- [AI Service Documentation](ai_service.md)

### Global Prerequisites
- Node.js (v20 recommended)
- Python 3.8+ (for AI Service)
- MongoDB instance (Atlas or local)
- Arduino IDE (for Hardware flashing)

Enjoy building and extending Park Pulse!