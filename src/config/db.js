const mongoose = require("mongoose");
const dns = require("dns");

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/parkpulse";
  const dnsServers = process.env.DNS_SERVERS;

  if (dnsServers) {
    dns.setServers(dnsServers.split(",").map((server) => server.trim()));
  }

  const connection = await mongoose.connect(mongoURI, {
    dbName: process.env.MONGO_DB || "parkpulse",
  });
  console.log(`MongoDB connected: ${connection.connection.host}`);
};

module.exports = connectDB;
