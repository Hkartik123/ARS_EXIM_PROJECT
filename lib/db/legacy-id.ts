export function withLegacyId<T extends { id: string }>(record: T) {
  return { ...record, _id: record.id };
}
