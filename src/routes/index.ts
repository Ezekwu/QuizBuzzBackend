import { Router } from "express";
import uploadRoutes from './upload.routes.js'
import { errorHandler } from "../middlewares/errorHandler.js";
import quizRoutes from "./quiz.routes.js";

const router = Router();

router.use('/upload', uploadRoutes)
router.use('/quiz', quizRoutes)

router.use(errorHandler);

export default router;
