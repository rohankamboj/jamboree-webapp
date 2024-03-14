export const sortByLatestLastUpdatedOnTimestamp = (a: { lastUpdatedOn: string }, b: { lastUpdatedOn: string }) => {
  if (a.lastUpdatedOn < b.lastUpdatedOn) return 1
  if (a.lastUpdatedOn > b.lastUpdatedOn) return -1
  return 0
}
