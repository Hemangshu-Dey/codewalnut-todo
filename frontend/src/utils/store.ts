import { create } from "zustand";

interface Todo {
  createdAt: Date;
  deadline: Date;
  description: string;
  isComplete: boolean;
  title: string;
  todoCategoryId: string;
  updatedAt: Date;
  __v: number;
  _id: string;
}

interface StoreState {
  currentUser: {
    userid: string;
    username: string;
    email: string;
  };
  setCurrentUser: (user: {
    userid: string;
    username: string;
    email: string;
  }) => void;

  categoryReRender: boolean;
  setCategoryReRender: (value: boolean) => void;

  todoReRender: boolean;
  setTodoReRender: (value: boolean) => void;

  activeCategory: string;
  setActiveCategory: (category: string) => void;

  popoverState: boolean;
  setPopoverState: (value: boolean) => void;

  todosState: Todo[];
  setTodosState: (todos: Todo[]) => void;
}

const useStore = create<StoreState>((set) => ({
  currentUser: {
    userid: "",
    username: "",
    email: "",
  },
  setCurrentUser: (user) =>
    set(() => ({
      currentUser: user,
    })),

  categoryReRender: false,
  setCategoryReRender: (value) =>
    set(() => ({
      categoryReRender: value,
    })),

  todoReRender: false,
  setTodoReRender: (value) =>
    set(() => ({
      todoReRender: value,
    })),

  activeCategory: "",
  setActiveCategory: (category) =>
    set(() => ({
      activeCategory: category,
    })),

  popoverState: false,
  setPopoverState: (value) =>
    set(() => ({
      popoverState: value,
    })),

  todosState: [],
  setTodosState: (todos) =>
    set(() => ({
      todosState: todos,
    })),
}));

export default useStore;
