// @ts-nocheck

import { getSum } from 'src/@core/utils/helpers'
import { plannerEventTypesColor } from '.'

// This is from the angular codebase
// Docs for this had several inconsistencies and missing info.
export function plannerTasksTimeCalc({
  taskRecords,
  prepDate,
  plannerTasks,
  examDate,
}: {
  taskRecords: tasks.UserRecommendedTask
  prepDate: number
  plannerTasks: UserPlannerQueryResponse['data']
  examDate: number
}) {
  let d: number = 0,
    m: number = 0,
    dTask: number = 0,
    cDate: number = 0,
    countTests: number = 0,
    durn: number = 0,
    output: { title: string; start: Date; end: Date; tag: string; meta: UserPlannerQueryResponse['data'][number] }[] =
      []

  /* Converting date to epoch format */
  cDate = prepDate
  d = examDate - prepDate
  let pendingTasks = []

  /* Setting multiplier value for No. of days for Tests */
  switch (true) {
    case d >= 6912000:
      m = 2
      break //82 days
    case 4320000 <= d && d < 6912000:
      m = 1.5
      break //52 to 81 days
    case 2592000 <= d && d < 4320000:
      m = 1
      break // 31 to 51 days
    default:
      alert('Your preparation time is less than 30 days. Please contact Faculty for guidance and detailed study plan.')
      break
  }

  for (var i = 0; i < plannerTasks.length; i++) {
    // if duration is more than 3 hours, then its a whole-day test
    plannerTasks[i].isTest = plannerTasks[i].type == 'test' && Number(plannerTasks[i].duration) > 10800
    plannerTasks[i].duration = Number(plannerTasks[i].duration)
    if (plannerTasks[i].isTest) {
      countTests++
    } else {
      dTask += plannerTasks[i].duration
    }
  }

  m = m * 24 * 3600
  d = d - countTests * m

  for (i = 0; i < plannerTasks.length; i++) {
    pendingTasks[i] = cDate * 1000 < Date.now() && taskRecords && taskRecords[plannerTasks[i].taskID] !== 1 ? 1 : 0
    // pendingTasks[i] = cDate * 1000 < Date.now() && taskRecords
    /*durn = plannerTasks[i].duration;
      if (durn < 3600) { durn = 3600; }*/

    if (cDate) {
      output[i] = {
        id: plannerTasks[i].taskID + plannerTasks[i].resourceID,
        title: plannerTasks[i].taskName,
        start: new Date(cDate * 1000),
        end: new Date((cDate + durn) * 1000),
        tag: '',
        meta: plannerTasks[i],
      }
    }
    if (taskRecords) {
      if (!pendingTasks[i]) {
        switch (taskRecords[plannerTasks[i].taskID]) {
          case 0:
            output[i].tag = 'amber'
            break
          case 1:
            output[i].tag = 'grey'
            break
        }
      } else {
        output[i].tag = 'red'
      }
    }
    cDate += plannerTasks[i].isTest ? m : Math.floor((d / dTask) * plannerTasks[i].duration)
  }
  output.push({
    id: 'exam',
    title: 'Exam D-Day',
    start: new Date(examDate * 1000),
    end: new Date((examDate + 14400) * 1000),
    tag: '',
    meta: null,
  })
  return { tasks: output, pendingTasksCount: getSum(pendingTasks) }
}

// Logic from angular codebase.
export function getRecordingsFromEvents(
  events: (WebinarItem & {
    id?: string
    title: string
    start: number
    end: number
    meta?: { taskType? }
  })[],
) {
  if (events?.length > 0) {
    let recordings = events.filter(x => {
      return x.meta?.taskType == 'webinars' && x.description?.indexOf('jamboree.zoom.us/rec') !== -1
    })
    recordings.forEach((element, i) => {
      let newString: string = ''
      let newLink: [] = element.description != undefined ? element.description.split('<br>') : []
      let numberOfRecordings = 0
      newLink.forEach((elem: string, i: number) => {
        newString += elem + '<br>'
        numberOfRecordings++
      })
      if (newString) {
        // @ts-ignore
        recordings[i]['numberOfRecordings'] = numberOfRecordings
        // @ts-ignore
        recordings[i]['link'] = newString
      }
    })

    // Sort by time
    recordings.sort((b, a) => {
      return a.start - b.start
    })

    return recordings
  }
  return []
}

export function parseBatches(batches: Batch[]) {
  return batches.map(Batch => {
    let updatedBatch = {
      title: Batch.title,
      meta: {
        ...Batch,
        taskType: 'class',
      },
      color: plannerEventTypesColor.class,
      ...Batch,
    }

    // Check the type of Batch.start and Batch.end
    if (typeof updatedBatch.start === 'string' && updatedBatch.start.length === 10) {
      updatedBatch.start = parseInt(updatedBatch.start) * 1000 // Multiply by 1000 for 10-digit epoch
    }

    if (typeof updatedBatch.end === 'string' && updatedBatch.end.length === 10) {
      updatedBatch.end = parseInt(updatedBatch.end) * 1000 // Multiply by 1000 for 10-digit epoch
    }

    updatedBatch.meta = {
      ...Batch,
      taskType: 'class',
    }

    updatedBatch.color = plannerEventTypesColor.class

    return updatedBatch
  })
}

export function parseSubjectCategory(nameToCheck: string) {
  const name = nameToCheck.toLowerCase()
  if (name.includes('verbal')) return 'Verbal'
  if (name.includes('quant') || name.includes('math')) return 'Quant'

  return 'Other'
}

export function getProductCodeForProductName(productName: string): 'gmat' | 'gre' | 'sat' | 'ielts' | string {
  const lowercasedProduct = productName.toLowerCase()
  if (lowercasedProduct.includes('gmat')) return 'gmat'
  if (lowercasedProduct.includes('gre')) return 'gre'
  if (lowercasedProduct.includes('sat')) return 'sat'
  if (lowercasedProduct.includes('ielts')) return 'ielts'

  return productName
}
