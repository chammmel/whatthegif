import { writable } from 'svelte/store';

export enum PopUpType {
  JOIN = 1,
  NONE = 2
}

export const currentPopUp = writable<PopUpType>(PopUpType.NONE);

export const closePopUp = () => currentPopUp.set(PopUpType.NONE);
