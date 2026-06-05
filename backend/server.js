const express = require("express");
const helmet = require("helmet");

const cors = require("cors");

const mongoose = require("mongoose");

require("dotenv").config();
const path = require("path");

const authRoutes = require("./routes/auth.routes");

const app = express();
app.set("trust proxy", 1);

// MIDDLEWARE
app.use(
  cors({
    origin: [
      "https://scholarhub-one.vercel.app",
      "http://localhost:5500",
      "http://127.0.0.1:5500"
    ],

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE"
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ],

    credentials: true
  })
);

app.options("*", cors());

app.use(
  express.json({
    limit: "10mb"
  })
);
app.use(helmet());

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

app.use("/api/auth", authRoutes);
// DATABASE
//console.log("MONGO_URI =", process.env.MONGO_URI);
mongoose.connect(process.env.MONGO_URI)

.then(() => {
  console.log("MongoDB Connected");
})

.catch((error) => {
  console.error(
    "MongoDB Connection Error:",
    error
  );
});

// SERVER
const PORT =
process.env.PORT || 5000;

app.listen(PORT,()=>{
 console.log(
  `Server Running on ${PORT}`
 );
});