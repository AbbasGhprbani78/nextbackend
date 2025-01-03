const mongoose = require("mongoose");

const connectToDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return true;
    } else {
      await mongoose.connect(process.env.MONGO_URL);
      console.log("Connect To DB Successfully :))");
    }
  } catch (error) {
    console.log("DB Connection has error ->", error);
  }
};

export default connectToDB;
