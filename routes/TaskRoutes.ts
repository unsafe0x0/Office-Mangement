import { Router } from "express";
import NewTask from "../controllers/task/NewTask";
import UpdateTask from "../controllers/task/UpdateTask";
import DeleteTask from "../controllers/task/DeleteTask";

import AuthMiddleware from "../middleware/AuthMiddleware";

const router = Router();

router.post("/new", AuthMiddleware, NewTask);
router.put("/update", AuthMiddleware, UpdateTask);
router.delete("/delete", AuthMiddleware, DeleteTask);

export default router;
