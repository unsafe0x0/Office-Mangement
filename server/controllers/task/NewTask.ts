import DbClient from "../../prisma/DbCLient";
import type { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { role: string };
}

const NewTask = async (req: AuthenticatedRequest, res: Response) => {
  const role = req.user?.role;

  if (!role || role !== "ADMIN") {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const { title, description, status, dueDate, employeeIds } = req.body;

  try {
    const newTask = await DbClient.task.create({
      data: {
        title,
        description,
        status,
        dueDate: new Date(dueDate),
        employeeIds,
      },
    });

    return res.status(201).json(newTask);
  } catch (error) {
    console.error("Create task error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default NewTask;
