import DbClient from "../../prisma/DbCLient";
import type { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { role: string };
}

const NewPayroll = async (req: AuthenticatedRequest, res: Response) => {
  const role = req.user?.role;

  if (!role || role !== "admin") {
    return res.status(400).json({ error: "Unauthorized access." });
  }

  const { employeeId, month, year, basicPay, bonus, deductions, netPay } =
    req.body;

  try {
    const newPayroll = await DbClient.payroll.create({
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

    return res.status(201).json(newPayroll);
  } catch (error) {
    console.error("Create payroll error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default NewPayroll;
