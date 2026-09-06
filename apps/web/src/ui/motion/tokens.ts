export const motionDuration = {
  none: 0,
  instant: 80,
  fast: 120,
  normal: 180,
  deliberate: 240,
  slow: 320,
} as const

export const motionEasing = {
  standard: [0.2, 0, 0, 1],
  enter: [0.16, 1, 0.3, 1],
  exit: [0.4, 0, 1, 1],
  emphasized: [0.16, 1, 0.3, 1],
} as const

export const motionDistance = {
  micro: 2,
  subtle: 4,
  normal: 8,
  prominent: 16,
} as const

export const semanticMotion = {
  feedback: {
    duration: motionDuration.instant,
    easing: motionEasing.standard,
  },
  enter: {
    duration: motionDuration.normal,
    easing: motionEasing.enter,
  },
  exit: {
    duration: motionDuration.instant,
    easing: motionEasing.exit,
  },
  disclosure: {
    duration: motionDuration.normal,
    easing: motionEasing.standard,
  },
  spatial: {
    duration: motionDuration.deliberate,
    easing: motionEasing.standard,
  },
  emphasis: {
    duration: motionDuration.normal,
    easing: motionEasing.emphasized,
  },
} as const

export const motionSpring = {
  settle: {
    stiffness: 420,
    damping: 36,
    mass: 1,
  },
  reorder: {
    stiffness: 380,
    damping: 32,
    mass: 0.9,
  },
  spatial: {
    stiffness: 400,
    damping: 35,
    mass: 1,
  },
} as const
