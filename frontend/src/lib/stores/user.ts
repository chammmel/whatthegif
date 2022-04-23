import { writable } from 'svelte/store';

export interface User {
  name: string;
  imageUrl: string;
  isAuthenticated: boolean;
}

export const user = writable<User>();
