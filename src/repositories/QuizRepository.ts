import QuizModel from "@models/quiz/QuizModel.js";
import { IQuiz } from "../types/IQuiz.js";

class QuizRepository {
  async createQuiz(quizData: IQuiz) {
    return await QuizModel.create(quizData);
  }

  async getUserQuizzes(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const query = { createdBy: userId };

    const [quizzes, total] = await Promise.all([
      QuizModel.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      QuizModel.countDocuments(query)
    ])

    const totalPages = Math.ceil(total / limit);

    return {
      data: quizzes,
      pagination: {
        page,
        limit,
        totalPages,
        total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }
  }


  async updateQuiz() { }

  async deleteQuiz() { }

}

export default new QuizRepository();
