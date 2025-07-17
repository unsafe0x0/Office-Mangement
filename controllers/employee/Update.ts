import DbClient from "../../prisma/DbCLient";
import bcrypt from "bcryptjs";
import type { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

const Update = async (req: AuthenticatedRequest, res: Response) => {
  const { name, email, password, profilePicture, phone, address } = req.body;
  const id = req.user?.id;

  if (!id) {
    return res.status(400).json({ error: "Employee ID is required." });
  }

  try {
    const existingEmployee = await DbClient.employee.findUnique({
      where: { id },
    });

    if (!existingEmployee) {
      return res.status(404).json({ error: "Employee not found." });
    }

    const updateData: any = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (profilePicture) updateData.profilePicture = profilePicture;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await DbClient.employee.update({
      where: { id },
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

export default Update;
