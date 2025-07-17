import { Router } from "express";
import Login from "../controllers/admin/Login";
import Register from "../controllers/admin/Register";
import Update from "../controllers/admin/Update";

import AuthMiddleware from "../middleware/AuthMiddleware";

const router = Router();

router.post("/login", Login);
router.post("/register", Register);
router.put("/update", AuthMiddleware, Update);

export default router;
