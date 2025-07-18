import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import adminRoutes from "./routes/AdminRoutes";
import employeeRoutes from "./routes/EmployeeRoutes";
import taskRoutes from "./routes/TaskRoutes";
import payrollRoutes from "./routes/PayrollRoutes";
import notificationRoutes from "./routes/NotificationRoutes";
import leaveRoutes from "./routes/LeaveRoutes";

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

app.get("/", (req, res) => {
  res.send("Welcome to the Office Management API");
});

app.get("/ping", (req, res) => {
  res.send("Server is running");
});

app.use("/admin", adminRoutes);
app.use("/employee", employeeRoutes);
app.use("/task", taskRoutes);
app.use("/payroll", payrollRoutes);
app.use("/notification", notificationRoutes);
app.use("/leave", leaveRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});
