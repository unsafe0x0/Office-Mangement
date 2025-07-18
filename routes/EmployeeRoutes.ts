import { Router } from "express";
import Login from "../controllers/employee/Login";
import Register from "../controllers/employee/Register";
import AuthMiddleware from "../middleware/AuthMiddleware";
import Update from "../controllers/employee/Update";
import GetInfo from "../controllers/employee/GetInfo";

const router = Router();

router.post("/login", Login);
router.post("/register", AuthMiddleware, Register);
router.put("/update", AuthMiddleware, Update);
router.get("/info", AuthMiddleware, GetInfo);

export default router;
