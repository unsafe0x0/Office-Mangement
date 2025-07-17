import DbClient from "../../prisma/DbCLient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";

const Login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const employee = await DbClient.employee.findUnique({
      where: { email },
    });

    if (!employee) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign({ id: employee.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Login successful.",
      token,
    });
  } catch (error) {
    console.error("Employee login error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default Login;
