import DbClient from "../../prisma/DbCLient";
import type { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { role: string; id: string };
}

const NewLeave = async (req: AuthenticatedRequest, res: Response) => {
  const role = req.user?.role;
  const id = req.user?.id;

  if (!role || role !== "EMPLOYEE") {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const { reason, startDate, endDate } = req.body;

  try {
    const employee = await DbClient.employee.findUnique({
      where: { id: id },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found." });
    }

    const leaveRequest = await DbClient.leave.create({
      data: {
        employeeId: id as string,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        reason,
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
