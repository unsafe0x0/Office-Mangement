import DbClient from "../../prisma/DbCLient";
import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { uploadImage } from "../../utils/Cloudinary";

interface AuthenticatedRequest extends Request {
  user?: { role: string };
  file?: Express.Multer.File;
}

const UpdateEmployee = async (req: AuthenticatedRequest, res: Response) => {
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
    employeeId,
  } = req.body;
  const role = req.user?.role;

  if (role != "ADMIN" && role != "EMPLOYEE") {
    return res.status(400).json({ error: "You are not authorized to update." });
  }

  try {
    const existingEmployee = await DbClient.employee.findUnique({
      where: { id: employeeId },
    });

    if (!existingEmployee) {
      return res.status(404).json({ error: "Employee not found." });
    }

    const updateData: any = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (position) updateData.position = position;
    if (department) updateData.department = department;
    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const { url } = await uploadImage(req.file.buffer, fileName);
      updateData.profilePicture = url;
    }
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (dateOfJoining) updateData.dateOfJoining = new Date(dateOfJoining);
    if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);
    if (salary) updateData.salary = parseFloat(salary);

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await DbClient.employee.update({
      where: { id: employeeId },
      data: updateData,
    });

    return res.status(200).json({
      message: "Employee updated successfully.",
    });
  } catch (error) {
    console.error("Employee update error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default UpdateEmployee;
