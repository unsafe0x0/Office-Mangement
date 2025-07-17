import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import adminRoutes from "./routes/AdminRoutes";
import employeeRoutes from "./routes/EmployeeRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
  })
);

app.get("/ping", (req, res) => {
  res.send("Server is running");
});

app.use("/admin", adminRoutes);
app.use("/employee", employeeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});
