/** Teardown returned by every client feature initializer. */
export type Dispose = () => void;

export const noop: Dispose = () => {};

/** Combines several disposers into one that runs them in reverse order. */
export function combine(disposers: ReadonlyArray<Dispose>): Dispose {
  return () => {
    for (let i = disposers.length - 1; i >= 0; i--) disposers[i]();
  };
}
