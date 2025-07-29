import DbClient from "../../prisma/DbCLient";
import type { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

const AdminDashboard = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.user?.id;
  const role = req.user?.role;

  if (!id || role !== "ADMIN") {
    console.error("Unauthorized access attempt by user:", req.user);
    return res.status(400).json({ error: "Unauthorized access." });
  }

  try {
    const admin = await DbClient.admin.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
      },
    });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found." });
    }

    const notifications = await DbClient.notification.findMany({
      select: {
        id: true,
        message: true,
        forWhom: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const tasksRaw = await DbClient.task.findMany({
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

    const allEmployeesMinimal = await DbClient.employee.findMany({
      select: {
        id: true,
        email: true,
      },
    });

    const employeeEmailMap = new Map(
      allEmployeesMinimal.map((emp) => [emp.id, emp.email]),
    );

    const tasks = tasksRaw.map((task) => ({
      ...task,
      employeeEmails: task.employeeIds.map(
        (empId) => employeeEmailMap.get(empId) || null,
      ),
    }));

    const employees = await DbClient.employee.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        position: true,
        department: true,
        phone: true,
        address: true,
        dateOfJoining: true,
        dateOfBirth: true,
        profilePicture: true,
        salary: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        attendance: {
          select: {
            id: true,
            status: true,
            date: true,
          },
        },
      },
    });

    const leaves = await DbClient.leave.findMany({
      select: {
        id: true,
        employeeId: true,
        startDate: true,
        endDate: true,
        reason: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const payrolls = await DbClient.payroll.findMany({
      select: {
        id: true,
        employeeId: true,
        month: true,
        year: true,
        basicPay: true,
        bonus: true,
        deductions: true,
        netPay: true,
        createdAt: true,
        updatedAt: true,
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
          },
        },
      },
    });

    return res.status(200).json({
      data: {
        admin,
        notifications,
        tasks,
        employees,
        leaves,
        payrolls,
      },
    });
  } catch (error) {
    console.error("Get admin info error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default AdminDashboard;
