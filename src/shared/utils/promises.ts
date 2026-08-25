//!strict
//!native
//!optimize 2

export async function promisifyEvent<Args extends unknown[]>(event: RBXScriptSignal<(...args: Args) => void>): Promise<Args> {
  return new Promise((resolve) => event.Once((...args) => resolve(args)));
}
