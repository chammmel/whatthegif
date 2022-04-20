import { writable } from 'svelte/store';

export enum PopUpType {
  JOIN = 1,
  NONE = 2
}

const currentPopUp = writable<PopUpType>(PopUpType.NONE);

export default { currentPopUp };
