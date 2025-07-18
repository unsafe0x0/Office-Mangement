import { Router } from "express";
import NewLeave from "../controllers/leave/NewLeave";
import UpdateLeave from "../controllers/leave/UpdateLeave";
import DeleteLeave from "../controllers/leave/DeleteLeave";

import AuthMiddleware from "../middleware/AuthMiddleware";

const leaveRoutes = Router();

leaveRoutes.post("/new", AuthMiddleware, NewLeave);
leaveRoutes.put("/update", AuthMiddleware, UpdateLeave);
leaveRoutes.delete("/delete", AuthMiddleware, DeleteLeave);

export default leaveRoutes;
