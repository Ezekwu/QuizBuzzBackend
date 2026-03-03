import QuizRepository from "@repositories/QuizRepository.js";

class QuizService {

  async createQuiz() {

  }

  async getQuiz() {

  }

  async getUserQuizzes(userId: string, page = 1, limit = 10) {
    return await QuizRepository.getUserQuizzes(userId, page, limit);
  }

  async updateQuiz() { }

  async deleteQuiz() { }

}

export default new QuizService();
