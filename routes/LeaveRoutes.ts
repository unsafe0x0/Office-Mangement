import { Router } from "express";
import NewLeave from "../controllers/leave/NewLeave";
import UpdateLeave from "../controllers/leave/UpdateLeave";
import DeleteLeave from "../controllers/leave/DeleteLeave";

import AuthMiddleware from "../middleware/AuthMiddleware";

const router = Router();

router.post("/new", AuthMiddleware, NewLeave);
router.put("/update", AuthMiddleware, UpdateLeave);
router.delete("/delete", AuthMiddleware, DeleteLeave);

export default router;
