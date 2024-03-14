import { ChangeEvent } from 'react'
import { ASSETS_BASE_URL, EQUATIONS_ASSETS_BASE_URL } from 'src/@core/utils/ApiHelpers'
import { BASE_URL } from 'src/apis/user'
// import { customQuizData } from 'src/pages/quiz/components/tabs/OnDemandQuiz'
import { GenericType, NavItem } from 'src/types/type'

export const convertDateToSeconds = (dateFromDatePicker: string) =>
  (new Date(dateFromDatePicker).getTime() / 1000).toString()

export const getErrorMessageFromType = (errorType: string) => {
  return `This field is ${errorType}`
}

export const addBaseUrlBeforeImageSrc = (content: string) =>
  content.replace(/<img src="(.*?)"/g, `<img src="${ASSETS_BASE_URL}$1"`)

export const replaceImageIDOccurrenceWithBaseUrl = (content: string) => {
  if (content.indexOf('ImageID') != -1) {
    return content.replace(/ImageID=([^\"]+)/g, (l: string) => {
      l = l.replace('ImageID=', '')
      let ext: string = '.jpg'
      if (l.indexOf('.') != -1) {
        ext = ''
      }
      return EQUATIONS_ASSETS_BASE_URL + l + ext
    })
  } else {
    return content
  }
}

export const handleInputImageChange = (
  file: ChangeEvent,
  setImgSrc: GenericType<string>,
  setInputValue?: GenericType<string>,
) => {
  const reader = new FileReader()
  const { files } = file.target as HTMLInputElement
  if (files && files.length !== 0) {
    reader.onload = () => setImgSrc(reader.result as string)
    reader.readAsDataURL(files[0])

    if (reader.result !== null && setInputValue) {
      setInputValue(reader.result as string)
    }
  }
}

export const getUrlPath = (path: string) => {
  return BASE_URL + path
}

export const getDayMonthAndYearFromTimestamp = (date: string) => {
  const parsedDate = new Date(date)

  // Get day, month, and year
  const day = parsedDate.getDate()
  const month = parsedDate.toLocaleString('default', { month: 'short' })
  const year = parsedDate.getFullYear().toString().slice(-2)

  // Format the date
  const formattedDate = `${day} ${month} ${year}`
  return formattedDate
}

export const getNavItemPath = (tagName: string, id: string) => `app/structure?tab=${tagName}&sectionid=${id}`

export const updateNavItems = (
  currentItems: NavItem[],
  sectionsToInsert: NavItem[],
  insertionIndex: number,
): NavItem[] => {
  const updatedNavItems = [...currentItems]
  const existingIds = updatedNavItems.reduce<Set<string>>((ids, item) => {
    ids.add(item.id)
    return ids
  }, new Set())

  sectionsToInsert.forEach(element => {
    if (!existingIds.has(element.id)) {
      updatedNavItems.splice(insertionIndex, 0, element)
      existingIds.add(element.id)
      insertionIndex += 1
    }
  })

  return updatedNavItems
}
export const getAlphabetAtIndex = (index: number): string => {
  const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const position = index - 1

  if (position >= 0 && position < alphabets.length) {
    return alphabets.charAt(position)
  } else {
    return ''
  }
}

export const capitalizeFirstLetter = (title: string) => {
  return title.slice(0, 1).toLocaleUpperCase() + title.slice(1)
}
