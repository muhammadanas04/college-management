import { useMemo } from "react";

export function useEntityLookup<T extends { id: string }>(entities: T[]): Map<string, T> {
  return useMemo(() => new Map(entities.map(e => [e.id, e])), [entities]);
}
