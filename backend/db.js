const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  // Connected to MongoDB
});
