import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import adminRoutes from "./routes/AdminRoutes";
import employeeRoutes from "./routes/EmployeeRoutes";
import taskRoutes from "./routes/TaskRoutes";
import payrollRoutes from "./routes/PayrollRoutes";
import notificationRoutes from "./routes/NotificationRoutes";
import leaveRoutes from "./routes/LeaveRoutes";
import attendanceRoutes from "./routes/AttendanceRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    maxAge: 3600 * 24 * 7,
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
app.use("/attendance", attendanceRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on PORT:${PORT}`);
});
