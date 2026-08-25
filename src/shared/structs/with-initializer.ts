export type WithInitializer<Args extends unknown[] = []> = {
  initialize(...args: Args): void | Promise<void>;
};
