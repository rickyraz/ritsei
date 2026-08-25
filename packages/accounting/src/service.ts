/** Compatibility factory/re-export surface; implementations live in postgres.ts and memory.ts. */
export * from "./contract.ts"
export * from "./errors.ts"
export { makeAccountingService } from "./postgres.ts"
export { makeAccountingTestLayer } from "./memory.ts"
