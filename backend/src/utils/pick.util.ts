export const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  return keys.reduce(
    (result, key) => {
      if (obj[key] !== undefined) {
        result[key] = obj[key];
      }
      return result;
    },
    {} as Pick<T, K>
  );
};
