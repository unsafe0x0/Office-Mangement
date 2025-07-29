import DbClient from "../../prisma/DbCLient";
import type { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { role: string };
}

const DeleteEmployee = async (req: AuthenticatedRequest, res: Response) => {
  const role = req.user?.role;

  if (!role || role !== "ADMIN") {
    return res.status(401).json({ error: "Unauthorized." });
  }

  const { employeeId } = req.body;

  try {
    const employee = await DbClient.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found." });
    }

    await DbClient.employee.delete({
      where: { id: employeeId },
    });

    return res.status(200).json({ message: "Employee deleted successfully." });
  } catch (error) {
    console.error("Delete employee error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default DeleteEmployee;
