import { create } from 'zustand';
import type { Question } from '../types';

interface SurveyBuilderState {
  title: string;
  description: string;
  questions: Question[];
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (id: string, question: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  reorderQuestion: (fromIndex: number, toIndex: number) => void;
  reorderQuestions: (questions: Question[]) => void;
  reset: () => void;
}

export const useSurveyBuilder = create<SurveyBuilderState>((set) => ({
  title: '',
  description: '',
  questions: [],
  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),
  addQuestion: (question) => set((state) => ({ 
    questions: [...state.questions, question] 
  })),
  updateQuestion: (id, updates) => set((state) => ({
    questions: state.questions.map((q) => 
      q.id === id ? { ...q, ...updates } : q
    ),
  })),
  deleteQuestion: (id) => set((state) => ({
    questions: state.questions.filter((q) => q.id !== id),
  })),
  reorderQuestion: (fromIndex, toIndex) => set((state) => {
    const newQuestions = [...state.questions];
    const [removed] = newQuestions.splice(fromIndex, 1);
    newQuestions.splice(toIndex, 0, removed);
    return { questions: newQuestions };
  }),
  reorderQuestions: (questions) => set({ questions }),
  reset: () => set({ title: '', description: '', questions: [] }),
}));
