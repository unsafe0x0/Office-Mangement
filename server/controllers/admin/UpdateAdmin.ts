import DbClient from "../../prisma/DbCLient";
import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { uploadImage } from "../../utils/Cloudinary";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
  file?: Express.Multer.File;
}

const UpdateAdmin = async (req: AuthenticatedRequest, res: Response) => {
  const { name, email, password } = req.body;
  const id = req.user?.id;

  if (!id) {
    return res.status(400).json({ error: "Admin ID is required." });
  }

  try {
    const existingAdmin = await DbClient.admin.findUnique({
      where: { id },
    });

    if (!existingAdmin) {
      return res.status(404).json({ error: "Admin not found." });
    }

    const updateData: any = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (req.file) {
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const { url } = await uploadImage(req.file.buffer, fileName);
      updateData.profilePicture = url;
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await DbClient.admin.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      message: "Admin updated successfully.",
    });
  } catch (error) {
    console.error("Admin update error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default UpdateAdmin;
