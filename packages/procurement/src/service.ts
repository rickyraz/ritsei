/** Compatibility factory surface; implementations live in postgres.ts and memory.ts. */
export * from "./contract.ts"
export * from "./errors.ts"
export { makeProcurementService } from "./postgres.ts"
export { makeProcurementTestLayer } from "./memory.ts"
