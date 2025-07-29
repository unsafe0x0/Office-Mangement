import DbClient from "../../prisma/DbCLient";
import type { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

const EmployeeInfo = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.user?.id;
  const role = req.user?.role;

  if (!id || role !== "EMPLOYEE") {
    return res.status(401).json({ error: "Unauthorized." });
  }

  try {
    const employee = await DbClient.employee.findUnique({
      where: { id },
      include: {
        attendance: {
          orderBy: { date: "desc" },
        },
        leaves: {
          orderBy: { startDate: "desc" },
        },
        payrolls: {
          orderBy: [{ year: "desc" }, { month: "desc" }],
        },
      },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found." });
    }

    const tasks = await DbClient.task.findMany({
      where: {
        employeeIds: { has: id },
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        dueDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const notifications = await DbClient.notification.findMany({
      where: {
        forWhom: { in: ["EMPLOYEE", "ALL"] },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        message: true,
        forWhom: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      employee,
      tasks,
      notifications,
    });
  } catch (error) {
    console.error("Get employee info error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default EmployeeInfo;
