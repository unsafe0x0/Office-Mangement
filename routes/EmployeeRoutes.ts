import { Router } from "express";
import Login from "../controllers/employee/Login";
import Register from "../controllers/employee/Register";
import AuthMiddleware from "../middleware/AuthMiddleware";

const router = Router();

router.post("/login", Login);
router.post("/register", AuthMiddleware, Register);

export default router;
