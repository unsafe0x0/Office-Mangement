import { Router } from "express";
import NewNotification from "../controllers/notification/NewNotification";
import UpdateNotification from "../controllers/notification/UpdateNotification";
import DeleteNotification from "../controllers/notification/DeleteNotification";

import AuthMiddleware from "../middleware/AuthMiddleware";

const router = Router();

router.post("/new", AuthMiddleware, NewNotification);
router.put("/update", AuthMiddleware, UpdateNotification);
router.delete("/delete", AuthMiddleware, DeleteNotification);

export default router;
