import DbClient from "../../prisma/DbCLient";
import type { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { role: string };
}

const UpdateLeave = async (req: AuthenticatedRequest, res: Response) => {
  const role = req.user?.role;

  if (!role || role !== "admin") {
    return res.status(400).json({ error: "Unauthorized access." });
  }

  const { leaveStatus, leaveId } = req.body;

  try {
    const leaveRequest = await DbClient.leave.findUnique({
      where: { id: leaveId },
    });

    if (!leaveRequest) {
      return res.status(404).json({ error: "Leave request not found." });
    }

    const updatedLeaveRequest = await DbClient.leave.update({
      where: { id: leaveId },
      data: {
        status: leaveStatus.toUpperCase(),
      },
    });

    return res.status(200).json({
      message: "Leave request updated successfully.",
      updatedLeaveRequest,
    });
  } catch (error) {
    console.error("Update leave error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default UpdateLeave;
