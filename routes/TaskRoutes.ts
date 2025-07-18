import { Router } from "express";
import NewTask from "../controllers/task/NewTask";
import UpdateTask from "../controllers/task/UpdateTask";
import DeleteTask from "../controllers/task/DeleteTask";

import AuthMiddleware from "../middleware/AuthMiddleware";

const taskRoutes = Router();

taskRoutes.post("/new", AuthMiddleware, NewTask);
taskRoutes.put("/update", AuthMiddleware, UpdateTask);
taskRoutes.delete("/delete", AuthMiddleware, DeleteTask);

export default taskRoutes;
