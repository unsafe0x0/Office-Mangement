import { Router } from "express";
import NewPayroll from "../controllers/payroll/NewPayroll";
import UpdatePayroll from "../controllers/payroll/UpdatePayroll";
import DeletePayroll from "../controllers/payroll/DeletePayroll";

import AuthMiddleware from "../middleware/AuthMiddleware";

const router = Router();

router.post("/new", AuthMiddleware, NewPayroll);
router.put("/update", AuthMiddleware, UpdatePayroll);
router.delete("/delete", AuthMiddleware, DeletePayroll);

export default router;
