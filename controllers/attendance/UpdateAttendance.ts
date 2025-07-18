import DbClient from "../../prisma/DbCLient";
import type { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { role: string };
}

const MarkAttendance = async (req: AuthenticatedRequest, res: Response) => {
  const role = req.user?.role;

  if (!role || role !== "employee") {
    return res.status(400).json({ error: "Unauthorized access." });
  }

  const { employeeId, status } = req.body;

  try {
    const employee = await DbClient.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found." });
    }

    const attendanceRecord = await DbClient.attendance.create({
      data: {
        employeeId,
        date: new Date(),
        status: status.toUpperCase(),
      },
    });

    return res
      .status(200)
      .json({ message: "Attendance updated successfully.", attendanceRecord });
  } catch (error) {
    console.error("Update attendance error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default MarkAttendance;
