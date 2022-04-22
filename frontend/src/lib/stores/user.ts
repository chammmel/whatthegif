import { writable } from 'svelte/store';

export interface User {
  name: string;
  imageUrl: string;
  isAuthenticated: boolean;
}

const user = writable<User>();

export default { user };
