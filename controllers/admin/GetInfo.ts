import DbClient from "../../prisma/DbCLient";
import type { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: string };
}

const GetInfo = async (req: AuthenticatedRequest, res: Response) => {
  const id = req.user?.id;
  const role = req.user?.role;

  if (!id || role !== "admin") {
    return res.status(400).json({ error: "Unauthorized access." });
  }

  try {
    const admin = await DbClient.admin.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        profilePicture: true,
      },
    });

    if (!admin) {
      return res.status(404).json({ error: "Admin not found." });
    }

    return res.status(200).json(admin);
  } catch (error) {
    console.error("Get admin info error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export default GetInfo;
