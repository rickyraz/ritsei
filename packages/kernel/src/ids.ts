import { v7 } from "uuid"

/** Generate a new UUIDv7 for an application-created persistent identity. */
export const uuidv7 = (): string => v7()
