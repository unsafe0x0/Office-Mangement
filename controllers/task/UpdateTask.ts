import DbClient from "../../prisma/DbCLient";
import type { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { role: string };
}

const UpdateTask = async (req: AuthenticatedRequest, res: Response) => {
  const role = req.user?.role;

  if (!role || role !== "admin") {
    return res.status(400).json({ error: "Unauthorized access." });
  }

  const { id, title, description, status, dueDate, employeeIds } = req.body;

  try {
    const updatedTask = await DbClient.task.update({
      where: { id },
      data: {
        title,
        description,
        status,
        dueDate,
        employeeIds,
      },
    });

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Update task error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default UpdateTask;
