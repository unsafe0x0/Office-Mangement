import DbClient from "../../prisma/DbCLient";
import type { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

const AllEmployee = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.user?.id;
  const role = req.user?.role;

  if (!id || role !== "admin") {
    return res.status(400).json({ error: "Unauthorized access." });
  }

  try {
    const employees = await DbClient.employee.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
        phone: true,
        address: true,
        position: true,
        department: true,
        dateOfJoining: true,
        dateOfBirth: true,
        salary: true,
        attendance: true,
        leaves: true,
        payrolls: true,
      },
      orderBy: { name: "asc" },
    });

    const allTasks = await DbClient.task.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        dueDate: true,
        employeeIds: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const data = employees.map((employee) => {
      const tasks = allTasks.filter((task) =>
        task.employeeIds.includes(employee.id)
      );
      return {
        ...employee,
        tasks,
      };
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error("Get all employees error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default AllEmployee;
