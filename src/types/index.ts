
// Types for the Recipe Repository

export interface User {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
  bio?: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  author: User;
  stars: number;
  forks: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  ingredients: Ingredient[];
  steps: Step[];
  versions: Version[];
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  unit?: string;
}

export interface Step {
  id: string;
  order: number;
  description: string;
  image?: string;
}

export interface Version {
  id: string;
  commitMessage: string;
  createdAt: string;
  author: User;
}
