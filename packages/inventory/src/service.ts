import * as Effect from "effect/Effect"

import type { InventoryService } from "./contract.ts"
import { makeInventoryPostgresService } from "./postgres.ts"

export const makeInventoryServiceFromStore = <R>(
  store: Effect.Effect<InventoryService, never, R>,
): Effect.Effect<InventoryService, never, R> =>
  Effect.gen(function* () {
    const implementation = yield* store
    return {
      createWarehouse: Effect.fn("InventoryService.createWarehouse")((input: unknown) =>
        implementation.createWarehouse(input)
      ),
      createItem: Effect.fn("InventoryService.createItem")((input: unknown) =>
        implementation.createItem(input)
      ),
      receiveStock: Effect.fn("InventoryService.receiveStock")((input: unknown) =>
        implementation.receiveStock(input)
      ),
      adjustStock: Effect.fn("InventoryService.adjustStock")((input: unknown) =>
        implementation.adjustStock(input)
      ),
      reserveStock: Effect.fn("InventoryService.reserveStock")((input: unknown) =>
        implementation.reserveStock(input)
      ),
      releaseReservation: Effect.fn("InventoryService.releaseReservation")((input: unknown) =>
        implementation.releaseReservation(input)
      ),
      fulfillReservation: Effect.fn("InventoryService.fulfillReservation")((input: unknown) =>
        implementation.fulfillReservation(input)
      ),
      createTransfer: Effect.fn("InventoryService.createTransfer")((input: unknown) =>
        implementation.createTransfer(input)
      ),
      confirmTransfer: Effect.fn("InventoryService.confirmTransfer")((input: unknown) =>
        implementation.confirmTransfer(input)
      ),
      completeTransfer: Effect.fn("InventoryService.completeTransfer")((input: unknown) =>
        implementation.completeTransfer(input)
      ),
    } satisfies InventoryService
  })

export const makeInventoryService = makeInventoryServiceFromStore(makeInventoryPostgresService)
