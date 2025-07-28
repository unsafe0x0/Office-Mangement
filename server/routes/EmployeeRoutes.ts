import { Router } from "express";
import EmployeeLogin from "../controllers/employee/EmployeeLogin";
import NewEmployee from "../controllers/employee/NewEmployee";
import UpdateEmployee from "../controllers/employee/UpdateEmployee";
import DeleteEmployee from "../controllers/employee/DeleteEmployee";
import EmployeeInfo from "../controllers/employee/EmployeeInfo";
import AllEmployee from "../controllers/employee/AllEmployee";
import multer from "multer";
import AuthMiddleware from "../middleware/AuthMiddleware";

const employeeRoutes = Router();
const upload = multer({ storage: multer.memoryStorage() });

employeeRoutes.post("/login", EmployeeLogin);
employeeRoutes.post(
  "/register",
  AuthMiddleware,
  upload.single("profilePicture"),
  NewEmployee
);
employeeRoutes.put("/update", AuthMiddleware, upload.single("profilePicture"), UpdateEmployee);
employeeRoutes.delete("/delete", AuthMiddleware, DeleteEmployee);
employeeRoutes.get("/info", AuthMiddleware, EmployeeInfo);
employeeRoutes.get("/all", AuthMiddleware, AllEmployee);

export default employeeRoutes;
