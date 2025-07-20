import DbClient from "../../prisma/DbCLient";
import type { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

const DeleteAdmin = async (req: AuthenticatedRequest, res: Response) => {
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

    await DbClient.admin.delete({
      where: { id },
    });

    return res.status(200).json({
      message: "Admin deleted successfully.",
    });
  } catch (error) {
    console.error("Admin deletion error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default DeleteAdmin;
