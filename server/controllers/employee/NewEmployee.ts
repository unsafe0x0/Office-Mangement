import DbClient from "../../prisma/DbCLient";
import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { uploadImage } from "../../utils/Cloudinary";

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
  file?: Express.Multer.File;
}

const NewEmployee = async (req: AuthenticatedRequest, res: Response) => {
  const {
    name,
    email,
    password,
    position,
    department,
    phone,
    address,
    dateOfJoining,
    dateOfBirth,
    salary,
  } = req.body;
  const role = req.user?.role;

  if (!role || role !== "ADMIN") {
    return res.status(403).json({ error: "Unauthorized." });
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

    let profilePicture = null;

    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const { url } = await uploadImage(req.file.buffer, fileName);
      profilePicture = url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await DbClient.employee.create({
      data: {
        name,
        email,
        password: hashedPassword,
        position,
        department,
        phone,
        address,
        dateOfJoining: new Date(dateOfJoining),
        dateOfBirth: new Date(dateOfBirth),
        salary: parseFloat(salary),
        profilePicture: profilePicture,
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

export default NewEmployee;
