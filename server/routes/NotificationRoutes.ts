import { Router } from "express";
import NewNotification from "../controllers/notification/NewNotification";
import UpdateNotification from "../controllers/notification/UpdateNotification";
import DeleteNotification from "../controllers/notification/DeleteNotification";

import AuthMiddleware from "../middleware/AuthMiddleware";

const notificationRoutes = Router();

notificationRoutes.post("/new", AuthMiddleware, NewNotification);
notificationRoutes.put("/update", AuthMiddleware, UpdateNotification);
notificationRoutes.delete("/delete", AuthMiddleware, DeleteNotification);

export default notificationRoutes;
