import { Router } from 'express';
import { requireAuth } from '@middlewares/auth.middleware.js';
import QuizController from '@controllers/quizController.js';

const router = Router()

// router.use(requireAuth);

router.get('/', requireAuth, QuizController.getUserQuizzes);
router.post('/', requireAuth, QuizController.createQuiz);


export default router
