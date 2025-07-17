import DbClient from "../../prisma/DbCLient";
import bcrypt from "bcryptjs";
import type { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

const Register = async (req: AuthenticatedRequest, res: Response) => {
  const { name, email, password } = req.body;
  const role = req.user?.role;

  if (!role || role !== "admin") {
    return res.status(403).json({ error: "Unauthorized access." });
  }

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const existingUser = await DbClient.employee.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Employee already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await DbClient.employee.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: "Employee registered successfully.",
    });
  } catch (error) {
    console.error("Employee registration error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default Register;
