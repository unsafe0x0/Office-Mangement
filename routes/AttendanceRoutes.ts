import { Router } from "express";
import MarkAttendance from "../controllers/attendance/MarkAttendance";
import UpdateAttendance from "../controllers/attendance/UpdateAttendance";

import AuthMiddleware from "../middleware/AuthMiddleware";

const attendanceRoutes = Router();

attendanceRoutes.post("/mark", AuthMiddleware, MarkAttendance);
attendanceRoutes.put("/update", AuthMiddleware, UpdateAttendance);

export default attendanceRoutes;
