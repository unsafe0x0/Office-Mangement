import DbClient from "../../prisma/DbCLient";
import type { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { role: string };
}

const UpdateAttendance = async (req: AuthenticatedRequest, res: Response) => {
  const role = req.user?.role;

  if (!role || role !== "ADMIN") {
    return res.status(400).json({ error: "Unauthorized access." });
  }

  const { employeeId, attendanceId, status } = req.body;

  try {
    const employee = await DbClient.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found." });
    }

    const attendanceRecord = await DbClient.attendance.update({
      where: {
        id: attendanceId,
      },
      data: {
        status: status.toUpperCase(),
      },
    });

    if (!attendanceRecord) {
      return res.status(404).json({ error: "Attendance record not found." });
    }

    return res.status(200).json({
      message: "Attendance updated successfully.",
      attendanceRecord,
    });
  } catch (error) {
    console.error("Update attendance error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default UpdateAttendance;
