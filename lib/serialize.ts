export type SerializedDoc = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
};

export function serializeDoc<T extends Record<string, unknown>>(doc: unknown): T {
  const raw = JSON.parse(JSON.stringify(doc)) as Record<string, unknown> & {
    _id?: { toString?: () => string } | string;
    __v?: unknown;
  };

  const id =
    typeof raw._id === "string"
      ? raw._id
      : raw._id?.toString
        ? raw._id.toString()
        : String(raw._id);

  delete raw._id;
  delete raw.__v;

  return { ...raw, id } as unknown as T;
}
