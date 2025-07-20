import { Router } from "express";
import AdminLogin from "../controllers/admin/AdminLogin";
import NewAdmin from "../controllers/admin/NewAdmin";
import UpdateAdmin from "../controllers/admin/UpdateAdmin";
import DeleteAdmin from "../controllers/admin/DeleteAdmin";
import AdminDashboard from "../controllers/admin/AdminDashboard";

import AuthMiddleware from "../middleware/AuthMiddleware";

const adminRoutes = Router();

adminRoutes.post("/login", AdminLogin);
adminRoutes.post("/register", NewAdmin);
adminRoutes.put("/update", AuthMiddleware, UpdateAdmin);
adminRoutes.delete("/delete", AuthMiddleware, DeleteAdmin);
adminRoutes.get("/dashboard", AuthMiddleware, AdminDashboard);

export default adminRoutes;
