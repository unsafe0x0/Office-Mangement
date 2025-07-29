import DbClient from "../../prisma/DbCLient";
import type { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { role: string };
}

const DeleteTask = async (req: AuthenticatedRequest, res: Response) => {
  const role = req.user?.role;

  if (!role || role !== "ADMIN") {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const { taskId } = req.body;

  try {
    await DbClient.task.delete({
      where: { id: taskId },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Delete task error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default DeleteTask;
