import { Document } from "mongoose";

export interface IOption {
  text: string;
  order: number;
  isCorrect: boolean;
}

export interface IQuestion {
  questionText: string;
  options: IOption[];
  timeLimit?: number;
  points?: number;
  order: number;
}

export interface ISettings {
  defaultTimeLimit: number;
  defaultPoints: number;
  showLeaderboardAfterEachQuestion: boolean;
  randomizeQuestionOrder: boolean;
}

export interface IQuiz extends Document {
  title: string;
  description?: string;
  coverImage?: string;
  questions: IQuestion[];
  settings: ISettings;
  createdBy: string;
}
