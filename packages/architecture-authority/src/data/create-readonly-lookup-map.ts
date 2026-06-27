const IMMUTABLE_LOOKUP_MAP_MESSAGE =
  "Architecture registry lookup maps are immutable" as const;

/**
 * Builds a runtime-immutable lookup map for public registry exports.
 * Mutating methods (`set`, `delete`, `clear`) throw — reads remain available.
 */
export function createReadonlyLookupMap<K, V>(
  entries: readonly (readonly [K, V])[]
): ReadonlyMap<K, V> {
  const map = new Map<K, V>(entries);

  return new Proxy(map, {
    get(target, property, receiver) {
      if (property === "set" || property === "delete" || property === "clear") {
        return () => {
          throw new Error(IMMUTABLE_LOOKUP_MAP_MESSAGE);
        };
      }

      const value = Reflect.get(target, property, receiver);
      if (typeof value === "function") {
        return value.bind(target);
      }

      return value;
    },
  }) as ReadonlyMap<K, V>;
}
