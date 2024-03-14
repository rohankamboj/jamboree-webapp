import { Box, Button, Grid, Slide, useMediaQuery, useTheme } from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  StyledBreadcrumbLink,
  CustomizedBreadcrumb,
  StyledLastBreadcrumb,
  StyledTitle,
} from 'src/@core/components/common/Breadcrumb'
import CustomHelmet from 'src/@core/components/common/CustomHelmet'
import FallbackSpinner from 'src/@core/components/common/Spinner'
import Typography from 'src/@core/components/common/Typography'
import IconifyIcon from 'src/@core/components/icon'
import { useUserContext } from 'src/@core/context/UserContext'
import { get } from 'src/@core/utils/request'
import { GET_TESTS, getUserTasksAndStructure } from 'src/apis/user'
import CourseSectionCard from './components/CourseSectionCard'
import SectionWiseDetailsCard from './components/SectionWiseDetailsCard'

export type TaskStructureWithDetail = {
  data: Array<{
    taskgroupID: number
    completed: number
    overallCompleted: number
    tasks: Array<{
      taskID: string
      taskName: string
      duration: string
      type: AllowedTaskTypes
      resourceID: string
      testStatus: string
      totalquestion: 0
    }>
  }>
}

export type TestAndPracticeAPIResponse = {
  records: Array<{
    attemptID: string
    lastUpdatedOn: string
    testID: string
  }>
  tests: Array<{
    taskID: string
    testID: string
    title: string
    testType: string
    testResource: null
    completed: 0 | 1
    active: 0 | 1
  }>
}

const generateBreadcrumbs = (sectionName: string) => [
  <StyledBreadcrumbLink underline='hover' key='1' to='/'>
    Dashboard
  </StyledBreadcrumbLink>,
  sectionName.split(':').map((item, i) => {
    if (i === 0) {
      return (
        <StyledBreadcrumbLink to='/' key='2'>
          {item}
        </StyledBreadcrumbLink>
      )
    } else {
      return <StyledLastBreadcrumb key='3'>{item}</StyledLastBreadcrumb>
    }
  }),
]
// Common Page for Learn, Quant, Test, Practice

interface TaskgroupWithChildren extends tasks.group {
  children: tasks.group[]
}

function convertTaskgroups(
  taskgroups: tasks.group[],
): [TaskgroupWithChildren[], Record<number, TaskgroupWithChildren>] {
  const parentMap: { [taskgroupID: number]: TaskgroupWithChildren } = {}

  const unprocessedChildren: tasks.group[] = []

  for (const taskgroup of taskgroups) {
    // Parent Element
    if (!taskgroup.relatedTo) {
      const parentCopy: TaskgroupWithChildren = Object.assign({ children: [] }, taskgroup)
      // @ts-ignore
      parentMap[taskgroup.taskgroupID] = parentCopy
    } else {
      const parent = parentMap[taskgroup.relatedTo]
      if (parent) {
        // Parent has already been processed
        parentMap[taskgroup.relatedTo].children.push(taskgroup)
      } else {
        unprocessedChildren.push(taskgroup)
      }
    }
  }

  while (unprocessedChildren.length > 0) {
    const child = unprocessedChildren.shift() as tasks.group
    const parent = parentMap[child?.relatedTo as number]

    if (parent) {
      parent.children.push(child)
    } else {
      unprocessedChildren.push(child)
    }
  }
  return [Object.values(parentMap), parentMap]
}

const extractTaskgroupChildrenGroupNames = (taskGroup: Pick<TaskgroupWithChildren, 'children'>) =>
  taskGroup.children.map(({ taskgroupName }) => taskgroupName)

function StructurePage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const activeTab = searchParams.get('tab')

  const { userTasksWithGroupAndSectionsQuery } = useUserContext()

  const [showRestOfCourseSectionCards, setShowRestOfCourseSectionCards] = useState(false)
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'))
  const expandedTaskGroupId: string = searchParams.get('tgId') || ''

  const setExpandedTaskGroupId = (taskGroupId?: string) => {
    if (taskGroupId) {
      setSearchParams(currentParams => {
        currentParams.set('tgId', taskGroupId.toString())
        return currentParams
      })
    }
  }

  const isTestOrPracticeSection = ['test', 'practice'].includes((activeTab || '')?.toLowerCase())

  const { data: userPracticeAndTestsPastAttempts } = useQuery({
    queryKey: ['GET_TESTS', activeTab],
    queryFn: () =>
      get(GET_TESTS, {
        queryParams: {
          type: (activeTab || '')?.toLowerCase(),
        },
      }) as Promise<TestAndPracticeAPIResponse>,
    enabled: !!isTestOrPracticeSection,
  })

  useEffect(() => {
    setExpandedTaskGroupId(undefined)
  }, [activeTab])

  const groups = userTasksWithGroupAndSectionsQuery?.data?.data ?? []

  const selectedSection = userTasksWithGroupAndSectionsQuery?.data?.sections.find(
    ({ tagName }) => activeTab === tagName,
  )

  const selectedSectionTasks = new Set(selectedSection?.taskgroupIDs)

  const handleNavigateToPastAttempts = () => {
    if (activeTab?.toLowerCase() === 'test') navigate('/app/test/past-attempt')
    else navigate('/app/practice/past-attempt')
  }

  const [groupsWithChildren, parentChildMap] = useMemo(
    () => convertTaskgroups(groups.filter(({ taskgroupID }) => selectedSectionTasks.has(taskgroupID.toString()))),
    [groups, selectedSectionTasks],
  )

  useEffect(() => {
    if (!expandedTaskGroupId && groupsWithChildren?.length) {
      setExpandedTaskGroupId(groupsWithChildren[0]?.taskgroupID)
    }
  }, [expandedTaskGroupId, groupsWithChildren])

  const groupIdsToFetch = useMemo(() => {
    if (!expandedTaskGroupId) return null

    // @ts-ignore
    const groupIds = parentChildMap[expandedTaskGroupId]?.children.map(({ taskgroupID }) => taskgroupID) || []
    groupIds.unshift(expandedTaskGroupId)
    return groupIds.join('-')
  }, [parentChildMap, expandedTaskGroupId])

  const { data: expandedTasksGroupResponse, isLoading: isExpandedTaskGroupLoading } = useQuery({
    queryKey: ['userTasksWithId', groupIdsToFetch, activeTab],
    queryFn: () => get(getUserTasksAndStructure + '/' + groupIdsToFetch) as Promise<TaskStructureWithDetail>,
    enabled: !!groupIdsToFetch,
    // staleTime: 10 * 60 * 1000,
  })

  if (userTasksWithGroupAndSectionsQuery.isLoading) return <FallbackSpinner />
  // getUserTasksAndStructure

  // TODO: Add the response from the sections dynamically to the sidebar route.
  // "sections": [
  //   {
  //       "id": "241",
  //       "tagName": "Learn: Verbal",
  //       "description": "",
  //       "taskgroupIDs": [
  //           "97",
  //       ]},{
  //         {
  //           "id": "240",
  //           "tagName": "Learn: Quantitative",
  //           "description": "",
  //           "taskgroupIDs": []
  //       }

  // @ts-ignore
  const selectedTaskGroup = parentChildMap[expandedTaskGroupId]
  const selectedTaskGroupChildren = selectedTaskGroup?.children
  if (selectedTaskGroupChildren) {
    selectedTaskGroupChildren?.unshift(selectedTaskGroup)
  }

  return (
    <Grid>
      <CustomHelmet title={activeTab ?? 'Learn'} />
      <Box display='flex' alignItems={'center'} overflow='scroll' gap={4}>
        <Box
          display='flex'
          alignItems='center'
          gap={2}
          sx={{
            borderRight: '2px solid #d6dce1',
          }}
        >
          <StyledTitle
            sx={{
              borderRight: '0px !important',
              paddingRight: '0px !important',
            }}
          >
            {selectedSection?.tagName.split(':')[0]}
          </StyledTitle>
          <StyledTitle
            sx={{
              borderRight: '0px !important',
            }}
          >
            {selectedSection?.tagName.split(':')[1]}
          </StyledTitle>
        </Box>
        <CustomizedBreadcrumb>{activeTab && generateBreadcrumbs(activeTab)}</CustomizedBreadcrumb>
      </Box>
      {selectedSection?.description && (
        <Box>
          <Typography
            variant='body1'
            dangerouslySetInnerHTML={{
              __html: selectedSection.description,
            }}
          />
        </Box>
      )}
      <Grid container spacing={8} mt={1}>
        {/* Modules Section */}
        <Grid item xs={12} md={4}>
          <Typography variant='h4' color='grey.200'>
            Modules
          </Typography>
          <Box sx={{ height: isSmallScreen ? '35vh' : '70vh', overflow: 'scroll' }} mt={1}>
            <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 5 }}>
              {/* Extract only parents */}
              {groupsWithChildren.map(
                ({ taskgroupAlias, taskgroupName, children, taskgroupID, overallCompleted }, idx) =>
                  // {groups.map((sectionData, idx) =>
                  isSmallScreen && !showRestOfCourseSectionCards && idx > 1 ? null : (
                    <CourseSectionCard
                      key={taskgroupID}
                      title={taskgroupAlias || taskgroupName}
                      description={extractTaskgroupChildrenGroupNames({ children }).join(' | ')}
                      onClickCard={() => setExpandedTaskGroupId(taskgroupID)}
                      percentageCompleted={overallCompleted || 0}
                      isSelected={taskgroupID == expandedTaskGroupId}
                    />
                  ),
              )}
              {isSmallScreen && (
                <Box
                  display='flex'
                  justifyContent='center'
                  alignItems='center'
                  gap={2}
                  border={`2px solid ${theme.palette.primary.main}`}
                  paddingY={2}
                  borderRadius={1}
                  onClick={() => setShowRestOfCourseSectionCards(!showRestOfCourseSectionCards)}
                >
                  <Typography variant='paragraphMedium' color={'primary.main'}>
                    {!showRestOfCourseSectionCards ? 'Show All Module' : 'Show Less Module'}
                  </Typography>
                  <IconifyIcon
                    color={theme.palette.primary.main}
                    icon={!showRestOfCourseSectionCards ? 'ep:arrow-down' : 'ep:arrow-up'}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
        {/* Overview Section  */}
        <Grid item xs={12} md={8} className='section-overview'>
          <div>
            <Box width='100%' display='flex' justifyContent='space-between' alignItems='end'>
              <Box display='flex' flexDirection='column'>
                <Typography variant='h4'>{selectedTaskGroup?.taskgroupAlias}</Typography>
              </Box>
              {isTestOrPracticeSection && (
                <Button onClick={handleNavigateToPastAttempts}>
                  Past Attempts &nbsp;
                  <IconifyIcon icon='wpf:past' />
                </Button>
              )}
            </Box>

            {isExpandedTaskGroupLoading ? (
              <FallbackSpinner
                sx={{
                  minHeight: 500,
                }}
                height='100%'
              />
            ) : (
              <Slide
                // easing={{
                //   enter: theme.transitions.easing.easeOut,
                // }}
                direction='up'
                timeout={500}
                in={!isExpandedTaskGroupLoading}
                unmountOnExit
                mountOnEnter
              >
                <Box sx={{ height: isSmallScreen ? '35vh' : '70vh', overflow: 'scroll' }}>
                  <Box display='flex' rowGap={4} flexDirection={'column'} paddingY={1} marginTop={2}>
                    {/*  TODO: Handle empty data response */}
                    {expandedTasksGroupResponse?.data?.map(taskGroup => (
                      <SectionWiseDetailsCard
                        key={'rightSideCard' + taskGroup.taskgroupID + activeTab}
                        activeTab={activeTab}
                        testResultList={userPracticeAndTestsPastAttempts}
                        showQuestionCount={isTestOrPracticeSection}
                        taskCompletionStatusMap={userTasksWithGroupAndSectionsQuery?.data?.records}
                        taskGroupMeta={selectedTaskGroupChildren?.find(
                          // @ts-ignore
                          ({ taskgroupID }) => taskgroupID == taskGroup.taskgroupID,
                        )}
                        taskGroup={taskGroup}
                      />
                    ))}
                  </Box>
                </Box>
              </Slide>
            )}
          </div>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default StructurePage
