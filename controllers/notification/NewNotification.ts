import DbClient from "../../prisma/DbCLient";
import type { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { role: string };
}

const NewNotification = async (req: AuthenticatedRequest, res: Response) => {
  const role = req.user?.role;

  if (!role || role !== "admin") {
    return res.status(400).json({ error: "Unauthorized access." });
  }

  const { message, forWhom } = req.body;

  try {
    const newNotification = await DbClient.notification.create({
      data: {
        message,
        forWhom,
      },
    });

    return res.status(201).json(newNotification);
  } catch (error) {
    console.error("Create notification error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default NewNotification;
