import { Request, Response, NextFunction } from "express";
import QuizService from "@services/quizService.js";

class QuizController {

  async createQuiz(req: Request, res: Response) { }

  async getUserQuizzes(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.auth;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const quizzes = await QuizService.getUserQuizzes(userId, page, limit);

      res.status(200).json(quizzes);
    } catch (error) {
      next(error)
    }
  }

  async getAllQuizzes(req: Request, res: Response) { }

  async updateQuiz(req: Request, res: Response) { }

  async deleteQuiz(req: Request, res: Response) { }

}

export default new QuizController();
