import DbClient from "../../prisma/DbCLient";
import type { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

const EmployeeInfo = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.user?.id;
  const role = req.user?.role;

  if (!id || role !== "employee") {
    return res.status(400).json({ error: "Unauthorized access." });
  }

  try {
    const employee = await DbClient.employee.findUnique({
      where: { id },
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
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found." });
    }

    const tasks = await DbClient.task.findMany({
      where: {
        employeeIds: {
          has: id,
        },
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
        forWhom: {
          in: ["ALL", "EMPLOYEE"],
        },
      },
      select: {
        id: true,
        message: true,
        createdAt: true,
      },
    });

    const data = {
      employee,
      tasks,
      notifications,
    };

    return res.status(200).json(data);
  } catch (error) {
    console.error("Get employee info error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default EmployeeInfo;
