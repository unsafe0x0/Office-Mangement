import DbClient from "../../prisma/DbCLient";
import type { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { role: string };
}

const UpdatePayroll = async (req: AuthenticatedRequest, res: Response) => {
  const role = req.user?.role;

  if (!role || role !== "admin") {
    return res.status(400).json({ error: "Unauthorized access." });
  }

  const {
    payrollId,
    employeeId,
    month,
    year,
    basicPay,
    bonus,
    deductions,
    netPay,
  } = req.body;

  try {
    const updatedPayroll = await DbClient.payroll.update({
      where: { id: payrollId },
      data: {
        employeeId,
        month,
        year,
        basicPay,
        bonus,
        deductions,
        netPay,
      },
    });

    return res.status(200).json(updatedPayroll);
  } catch (error) {
    console.error("Update payroll error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default UpdatePayroll;
