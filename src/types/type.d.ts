export type AccountAboutType = {
  icon: string
  value: string
  property: string
}

export type GenericType<T> = (value: T) => void

export interface Section {
  id: number
  tagName: string
}

export interface NavItem {
  id: string
  title: string
  icon: string
  path: string
  children?: { title: string; path: string }[]
}

export type VerticalNavItemsType = { [key: string]: NavItem }
