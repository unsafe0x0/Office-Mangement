import DbClient from "../../prisma/DbCLient";
import type { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { role: string };
}

const DeleteNotification = async (req: AuthenticatedRequest, res: Response) => {
  const role = req.user?.role;

  if (!role || role !== "admin") {
    return res.status(400).json({ error: "Unauthorized access." });
  }

  const { notificationId } = req.body;

  try {
    await DbClient.notification.delete({
      where: { id: notificationId },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Delete notification error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default DeleteNotification;
