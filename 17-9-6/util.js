// @flow

export function typeErrorAsNull<A>(f: () => A): ?A {
  try {
    return f();
  } catch (e) {
    if (e instanceof TypeError) {
      return null;
    } else {
      throw e;
    }
  }
}
