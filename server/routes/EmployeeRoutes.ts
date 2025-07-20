import { Router } from "express";
import EmployeeLogin from "../controllers/employee/EmployeeLogin";
import NewEmployee from "../controllers/employee/NewEmployee";
import UpdateEmployee from "../controllers/employee/UpdateEmployee";
import DeleteEmployee from "../controllers/employee/DeleteEmployee";
import EmployeeInfo from "../controllers/employee/EmployeeInfo";
import AllEmployee from "../controllers/employee/AllEmployee";

import AuthMiddleware from "../middleware/AuthMiddleware";

const employeeRoutes = Router();

employeeRoutes.post("/login", EmployeeLogin);
employeeRoutes.post("/register", AuthMiddleware, NewEmployee);
employeeRoutes.put("/update", AuthMiddleware, UpdateEmployee);
employeeRoutes.delete("/delete", AuthMiddleware, DeleteEmployee);
employeeRoutes.get("/info", AuthMiddleware, EmployeeInfo);
employeeRoutes.get("/all", AuthMiddleware, AllEmployee);

export default employeeRoutes;
