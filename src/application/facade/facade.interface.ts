export type FacadeInterface<T> = {
  [key in keyof T]: T[key];
};
