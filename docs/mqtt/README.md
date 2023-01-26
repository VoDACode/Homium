# MQTT Protocol

## Structure

```
└──Homium
    ├── objects
    │    ├── [ObjectID]
    │    │    └── properties
    │    │         ├── [Property Key]
    │    │         │    ├── get
    │    │         │    └── set
    │    │         └── Other Properties...
    │    └── Other Objects...
    ├── devices
    │    ├── [DeviceID]
    │    │    └── properties
    │    │         ├── [Property Key]
    │    │         │    ├── get
    │    │         │    └── set
    │    │         └── Other Properties...
    │    └── Other Devices...
    ├── System
    │    ├── Status
    │    ├── Statistics
    │    │    ├── CPU
    │    │    ├── Memory
    │    │    ├── Network
    │    │    │     ├── [Interface]
    │    │    │     │    ├── RX
    │    │    │     │    └── TX
    │    │    │     └── Other Interfaces...
    │    │    ├── IO
    │    │    │     ├── Read
    │    │    │     ├── Write
    │    │    └── Other Statistics...
    │    ├── Logs
    │    │    ├── [Log Type]
    │    │    │    └── [Log Level]
    │    │    │         ├── [Log ID]
    │    │    │         │    ├── Time
    │    │    │         │    ├── Message
    │    │    │         │    └── Data
    │    │    │         └── Other Logs...
    │    │    └── Other Log Types...
    │    └── Other System Topics...
    └── Other Topics...
```
