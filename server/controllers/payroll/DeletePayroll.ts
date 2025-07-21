import DbClient from "../../prisma/DbCLient";
import type { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { role: string };
}

const DeletePayroll = async (req: AuthenticatedRequest, res: Response) => {
  const role = req.user?.role;

  if (!role || role !== "ADMIN") {
    return res.status(400).json({ error: "Unauthorized access." });
  }

  const { payrollId } = req.body;

  try {
    await DbClient.payroll.delete({
      where: { id: payrollId },
    });

    return res.status(204).send();
  } catch (error) {
    console.error("Delete payroll error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default DeletePayroll;
