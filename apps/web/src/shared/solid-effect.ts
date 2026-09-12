import { Cause, Effect, Exit, Fiber, Layer, ManagedRuntime } from "effect"
import { action, createContext, onCleanup, useContext } from "solid-js"

type SolidEffectRuntime = ManagedRuntime.ManagedRuntime<never, never>

/** The scoped Effect runtime used by the Solid application subtree. */
export const RuntimeContext = createContext<SolidEffectRuntime | null>(null)

/** Raised when an Effect bridge is used outside a runtime provider. */
export class MissingRuntimeContextError extends Error {
  constructor() {
    super("Solid Effect runtime is not provided by RuntimeContext")
    this.name = "MissingRuntimeContextError"
  }
}

/**
 * Builds a runtime whose Layer scope follows the current Solid owner.
 * Nested providers share the parent's Effect MemoMap without becoming a global registry.
 */
export function createRuntime<R>(
  layer: Layer.Layer<R>,
): ManagedRuntime.ManagedRuntime<R, never> {
  const parent = useContext(RuntimeContext)
  const runtime = ManagedRuntime.make(
    layer,
    parent ? { memoMap: parent.memoMap } : undefined,
  )
  onCleanup(() => void runtime.dispose())
  return runtime
}

function resolveRuntime(): SolidEffectRuntime {
  const runtime = useContext(RuntimeContext)
  if (!runtime) throw new MissingRuntimeContextError()
  return runtime
}

function resolveFork() {
  const runtime = resolveRuntime()
  return <A, E, R>(effect: Effect.Effect<A, E, R>) =>
    // RuntimeContext intentionally erases the provider's concrete R so nested
    // providers can carry different service sets through one Solid context.
    runtime.runFork(effect as Effect.Effect<A, E, never>)
}

/**
 * Adapts one Effect result to Solid's async-source protocol.
 * Solid supersession/disposal calls `return()`, which interrupts the fiber and
 * waits for its finalizers before the iterator closes.
 */
export function runEffect<A, E, R = never>(
  effect: Effect.Effect<A, E, R>,
): AsyncIterable<A> {
  const fork = resolveFork()
  return {
    [Symbol.asyncIterator]() {
      const fiber = fork(effect)
      let yielded = false
      let closed = false
      const done = { done: true, value: undefined } as const
      return {
        async next(): Promise<IteratorResult<A>> {
          if (yielded || closed) return done
          const exit = await Effect.runPromise(Fiber.await(fiber))
          if (closed) return done
          if (Exit.isSuccess(exit)) {
            yielded = true
            return { done: false, value: exit.value }
          }
          closed = true
          if (Exit.isFailure(exit)) {
            const cause = exit.cause
            if (Exit.hasInterrupts(exit)) return done
            throw Cause.squash(cause)
          }
          return done
        },
        async return(): Promise<IteratorResult<A>> {
          if (yielded || closed) return done
          closed = true
          await Effect.runPromise(Fiber.interrupt(fiber))
          return done
        },
      }
    },
  }
}

/** Typed interruption delivered to an Effect action's generator. */
export class ActionInterruptedError extends Error {
  constructor() {
    super("Action interrupted")
    this.name = "ActionInterruptedError"
  }
}

type SagaStep<R> = Effect.Effect<unknown, unknown, R>

export interface EffectAction<Args extends unknown[], A> {
  (...args: Args): Promise<A>
  interrupt(): void
}

/**
 * Runs each yielded Effect as an interruptible Solid action step.
 * Use for explicit workflows; TanStack Query remains the owner of shared
 * server-state caching and invalidation.
 */
export function effectAction<Args extends unknown[], A, R = never>(
  genFn: (...args: Args) => Generator<SagaStep<R>, A, never>,
): EffectAction<Args, A> {
  const fork = resolveFork()
  let inFlight: Fiber.Fiber<unknown, unknown> | null = null

  const base = action(function* (...args: Args) {
    const iterator = genFn(...args)
    let step = iterator.next()
    while (!step.done) {
      const fiber = fork(step.value)
      inFlight = fiber
      const exit: Exit.Exit<unknown, unknown> = yield Effect.runPromise(
        Fiber.await(fiber),
      )
      if (inFlight === fiber) inFlight = null
      if (Exit.isSuccess(exit)) {
        step = iterator.next(exit.value as never)
      } else if (Exit.isFailure(exit)) {
        const cause = exit.cause
        if (Exit.hasInterrupts(exit)) {
          step = iterator.throw(new ActionInterruptedError())
        } else {
          step = iterator.throw(Cause.squash(cause))
        }
      }
    }
    return step.value
  })

  const invoke = (...args: Args) => {
    invoke.interrupt()
    return base(...args)
  }
  invoke.interrupt = () => {
    const fiber = inFlight
    inFlight = null
    if (fiber) void Effect.runPromise(Fiber.interrupt(fiber))
  }
  return invoke
}
