import DbClient from "../../prisma/DbCLient";
import type { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { role: string };
}

const DeleteLeave = async (req: AuthenticatedRequest, res: Response) => {
  const role = req.user?.role;

  if (!role || role !== "EMPLOYEE") {
    return res.status(400).json({ error: "Unauthorized access." });
  }

  const { leaveId } = req.params;

  try {
    const leaveRequest = await DbClient.leave.findUnique({
      where: { id: leaveId, status: "PENDING" },
    });

    if (!leaveRequest) {
      return res.status(404).json({ error: "Leave request not found." });
    }

    await DbClient.leave.delete({
      where: { id: leaveId },
    });

    return res
      .status(200)
      .json({ message: "Leave request deleted successfully." });
  } catch (error) {
    console.error("Delete leave error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default DeleteLeave;
