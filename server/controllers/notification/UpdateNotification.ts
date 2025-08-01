import DbClient from "../../prisma/DbCLient";
import type { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { role: string };
}

const UpdateNotification = async (req: AuthenticatedRequest, res: Response) => {
  const role = req.user?.role;

  if (!role || role !== "ADMIN") {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const { notificationId, message, forWhom } = req.body;

  try {
    const updatedNotification = await DbClient.notification.update({
      where: { id: notificationId },
      data: {
        message,
        forWhom,
      },
    });

    return res.status(200).json(updatedNotification);
  } catch (error) {
    console.error("Update notification error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default UpdateNotification;
