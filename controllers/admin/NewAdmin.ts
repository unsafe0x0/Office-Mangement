import DbClient from "../../prisma/DbCLient";
import bcrypt from "bcryptjs";
import type { Request, Response } from "express";

const NewAdmin = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const existingUser = await DbClient.admin.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Admin already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await DbClient.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({
      message: "Admin registered successfully.",
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default NewAdmin;
