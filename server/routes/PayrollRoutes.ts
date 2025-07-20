import { Router } from "express";
import NewPayroll from "../controllers/payroll/NewPayroll";
import UpdatePayroll from "../controllers/payroll/UpdatePayroll";
import DeletePayroll from "../controllers/payroll/DeletePayroll";

import AuthMiddleware from "../middleware/AuthMiddleware";

const payrollRoutes = Router();

payrollRoutes.post("/new", AuthMiddleware, NewPayroll);
payrollRoutes.put("/update", AuthMiddleware, UpdatePayroll);
payrollRoutes.delete("/delete", AuthMiddleware, DeletePayroll);

export default payrollRoutes;
