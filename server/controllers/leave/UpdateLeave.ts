import DbClient from "../../prisma/DbCLient";
import type { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

const UpdateLeave = async (req: AuthenticatedRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const { leaveId, leaveStatus, startDate, endDate, reason } = req.body;

  if (!leaveId) {
    return res.status(400).json({ error: "Leave ID is required." });
  }

  try {
    const leave = await DbClient.leave.findUnique({
      where: { id: leaveId },
    });

    if (!leave) {
      return res.status(404).json({ error: "Leave request not found." });
    }

    if (user.role === "ADMIN") {
      if (!leaveStatus) {
        return res.status(400).json({ error: "Missing status update." });
      }

      const updatedLeave = await DbClient.leave.update({
        where: { id: leaveId },
        data: {
          status: leaveStatus.toUpperCase(),
        },
      });

      return res.status(200).json({
        message: "Leave status updated successfully.",
        updatedLeave,
      });
    }

    if (user.role === "EMPLOYEE") {
      if (leave.employeeId !== user.id) {
        return res
          .status(403)
          .json({ error: "Access denied to this leave request." });
      }

      if (leave.status !== "PENDING") {
        return res
          .status(400)
          .json({ error: "Only pending leaves can be updated." });
      }

      const updatedLeave = await DbClient.leave.update({
        where: { id: leaveId },
        data: {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          reason,
        },
      });

      return res.status(200).json({
        message: "Leave updated successfully.",
        updatedLeave,
      });
    }

    return res.status(403).json({ error: "Unauthorized role." });
  } catch (error) {
    console.error("Update leave error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default UpdateLeave;
