export type selectedCourseMinMaxAndIntervalType = {
  min: number
  max: number
  increments: number
}

export const noDataMinMaxAndIncrements: selectedCourseMinMaxAndIntervalType = {
  min: 0,
  max: 0,
  increments: 0,
}

// Map received from jamboree team
// GRE -260 to 340, 1 point increments
// DSAT - 400 to 1600, 10 point increments
// IELTS - 0 to 9, 0.5 point increments
// GMAT -205 to 805, 10 points increments
export const courseToScoreMap = {
  gre: {
    min: 360,
    max: 340,
    increments: 1,
  },
  sat: {
    min: 400,
    max: 1600,
    increments: 10,
  },
  ielts: {
    min: 0,
    max: 9,
    increments: 0.5,
  },
  gmat: {
    min: 205,
    max: 805,
    increments: 10,
  },
  NO_PRODUCT: {
    min: 0,
    max: 0,
    increments: 0,
  },
} as const

export type courseToMaxMinAndIncrementsType = typeof courseToScoreMap

export const checkTargetScoreAndReturnError = (
  targetScore: string | number,
  courseCriteria: selectedCourseMinMaxAndIntervalType,
) => {
  const parsedTargetScore = Number(targetScore)

  if (parsedTargetScore < courseCriteria.min || parsedTargetScore > courseCriteria.max) {
    return {
      error: true,
      message: `Score should be in between ${courseCriteria.min} to ${courseCriteria.max}`,
    }
  }

  if ((parsedTargetScore - courseCriteria.min) % courseCriteria.increments !== 0) {
    return {
      error: true,
      message: `Score should be in between ${courseCriteria.min} to ${courseCriteria.max} in increments of ${courseCriteria.increments}`,
    }
  }

  return {
    error: false,
    message: '',
  }
}
