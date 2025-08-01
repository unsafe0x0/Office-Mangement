import DbClient from "../../prisma/DbCLient";
import type { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { role: string };
}

const NewNotification = async (req: AuthenticatedRequest, res: Response) => {
  const role = req.user?.role;

  if (!role || role !== "ADMIN") {
    return res.status(401).json({ error: "Unauthorized." });
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
