const EventEmitter = require("events");

const slotEvents = new EventEmitter();
slotEvents.setMaxListeners(100);

module.exports = slotEvents;
