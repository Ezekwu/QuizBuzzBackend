import { IQuiz, IOption, IQuestion, ISettings } from '../../types/IQuiz.js'
import mongoose, { Schema, Document } from "mongoose";

const optionSchema = new Schema<IOption>({
  text: { type: String, required: true },
  order: { type: Number, min: 0, required: true },
  isCorrect: { type: Boolean, required: true },
}, { _id: true });

const questionSchema = new Schema<IQuestion>({
  questionText: { type: String, required: true },
  options: {
    type: [optionSchema], validate: {
      validator: (options: IOption[]) => {
        return options.length >= 2;
      },
      message: 'Question must have at least 2 options'
    }, required: true
  },
  timeLimit: { type: Number, default: 30 },
  points: { type: Number, default: 10 },
  order: { type: Number, required: true },
});

const settingsSchema = new Schema<ISettings>({
  defaultTimeLimit: { type: Number, default: 30 },
  defaultPoints: { type: Number, default: 10 },
  showLeaderboardAfterEachQuestion: { type: Boolean, default: false },
  randomizeQuestionOrder: { type: Boolean, default: false },
});

const quizSchema = new Schema<IQuiz>({
  title: { type: String, required: true },
  description: { type: String },
  coverImage: { type: String },
  questions: { type: [questionSchema], required: true },
  settings: { type: settingsSchema, required: true },
  createdBy: { type: String, required: true },
}, { timestamps: true });

const QuizModel = mongoose.model<IQuiz>('Quiz', quizSchema);

export default QuizModel;
