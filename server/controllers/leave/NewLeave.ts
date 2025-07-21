import DbClient from "../../prisma/DbCLient";
import type { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { role: string };
}

const NewLeave = async (req: AuthenticatedRequest, res: Response) => {
  const role = req.user?.role;

  if (!role || role !== "EMPLOYEE") {
    return res.status(400).json({ error: "Unauthorized access." });
  }

  const { employeeId, leaveType, startDate, endDate } = req.body;

  try {
    const employee = await DbClient.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found." });
    }

    const leaveRequest = await DbClient.leave.create({
      data: {
        employeeId,
        startDate,
        endDate,
        reason: leaveType,
        status: "PENDING",
      },
    });

    return res
      .status(201)
      .json({ message: "Leave request created successfully.", leaveRequest });
  } catch (error) {
    console.error("New leave error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default NewLeave;
