import { Typography } from '@mui/material'
// import Icon from 'src/@core/components/icon'
// import { getDayMonthAndYearFromTimestampWithFullMonth } from 'src/@core/utils/helpers'
// import { FilterType, getAdjustedDate, getFormattedTimeString } from '..'
// import { parseSubjectCategory } from 'src/pages/planner/helpers'

// TODO: Integrate this logic in the app.
// Angular App Logic
// function getRecordingsToRenderFromBatches(batches: Batch[]) {
//   res.forEach((element, i) => {
//     let newString: string = ''
//     // let newLink: [] = element.meta.description.split("<br>");
//     let htmlTags: [] = element.meta.description != undefined ? element.meta.description.split('<br>') : ''
//     let numberOfRecordings = 0
//     htmlTags.forEach((elem: string, i: number) => {
//       if (elem.indexOf('jamboree.zoom.us/rec') !== -1) {
//         newString += elem + '<br>'
//         numberOfRecordings++
//       }
//     })
//     if (newString) {
//       this.tableDescAll.push(
//         (bobj[i] = {
//           batchname: element.meta.batchname,
//           link: newString,
//           numberOfRecordings: numberOfRecordings,
//           date: element.meta.start.dateTime,
//           start: element.meta.start,
//           end: element.meta.end,
//           summary: element.meta.summary,
//         }),
//       )
//       this.tableDesc = this.tableDescAll.sort((b, a) => {
//         return Date.parse(a.date) - Date.parse(b.date)
//       })
//     }
//   })
// }

// TODO: Refactor this to use the timeline component.
const Recordings = ({} // data,
// setActiveFilter,
// activeFilter,
: {
  // data: Batch[] | undefined
  // setActiveFilter: (activeFilter: FilterType) => void
  // activeFilter: FilterType
}) => {
  // const [selectedCard, setSelectedCard] = useState<number | null>(null)

  // const handleView = (id: number) => {
  //   setSelectedCard(id + 1)
  // }

  // const theme = useTheme()

  // const StyledBox = styled(Box)<BoxProps>({
  //   display: 'flex',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   marginTop: 8,
  // })

  return <Typography>No Recordings to show.</Typography>

  // return (
  //   <Grid>
  //     <Box
  //       display='flex'
  //       gap={2}
  //       alignItems='center'
  //       position='absolute'
  //       sx={{
  //         '@media (max-width:410px)': { top: '80px', left: '40px' },
  //         '@media (min-width:410px)': { top: '35px', right: '0px' },
  //       }}
  //     >
  //       <Box width={10} height={10} borderRadius='100%' bgcolor='primary.main'></Box>
  //       <Typography
  //         variant={activeFilter === 'Verbal' ? 'h5' : 'h6'}
  //         sx={{ cursor: 'pointer' }}
  //         onClick={() => setActiveFilter('Verbal')}
  //       >
  //         Verbal
  //       </Typography>
  //       <Box width={10} height={10} borderRadius={'100%'} bgcolor={'#FF9F43'}></Box>
  //       <Typography
  //         variant={activeFilter === 'Quant' ? 'h5' : 'h6'}
  //         sx={{ cursor: 'pointer' }}
  //         onClick={() => setActiveFilter('Quant')}
  //       >
  //         Quant
  //       </Typography>
  //     </Box>
  //     <Box
  //       display='flex'
  //       justifyContent='space-between'
  //       width='100%'
  //       sx={{
  //         '@media (max-width:410px)': { mt: '40px' },
  //       }}
  //     >
  //       <Box
  //         //  @ts-ignore
  //         border={theme => theme.border}
  //         borderRadius={1}
  //         sx={{
  //           borderTopLeftRadius: '0px',
  //           borderTopRightRadius: '0px',
  //           '@media (max-width:910px)': { width: '100%' },
  //           '@media (min-width:910px)': { width: selectedCard ? '65%' : '100%' },
  //           '@media (min-width:1500px)': { width: selectedCard ? '75%' : '100%' },
  //         }}
  //       >
  //         {data?.map((item, idx) => (
  //           <Box
  //             key={item.batchname + idx}
  //             padding={4}
  //             display='flex'
  //             alignItems='center'
  //             justifyContent='space-between'
  //             borderBottom='1px solid #DBDADE'
  //             sx={{
  //               cursor: 'pointer',
  //               '& .hidden-button': {
  //                 display: 'none',
  //               },
  //               '&:hover .hidden-button ': { display: 'block' },
  //             }}
  //           >
  //             <Box gap={2} display='flex' alignItems='center'>
  //               <Box
  //                 bgcolor='#E6EAE7'
  //                 borderRadius='100%'
  //                 border={`1px solid ${theme.palette.grey[50]}`}
  //                 display='flex'
  //                 justifyContent='center'
  //                 alignItems='center'
  //                 sx={{
  //                   '@media (max-width:410px)': { width: '25px', height: '25px', padding: '2px' },
  //                   '@media (min-width:410px)': { width: '35px', height: '35px' },
  //                 }}
  //               >
  //                 <Icon icon='lucide:video' color={theme.palette.grey[50]} />
  //               </Box>
  //               <Box display='flex' flexDirection='column'>
  //                 <Typography variant='h6'>
  //                   {item.title} {item.batchname}
  //                 </Typography>
  //                 {/* @ts-ignore */}
  //                 <Typography
  //                   color={'#A5A3AE'}
  //                   sx={{
  //                     '@media (max-width:911px)': { display: 'block' },
  //                     '@media (min-width:910px)': { display: 'none' },
  //                   }}
  //                 >
  //                   {getFormattedTimeString(item.start)} - {getFormattedTimeString(item.end)}
  //                 </Typography>
  //               </Box>
  //             </Box>
  //             <Box
  //               gap={2}
  //               display='flex'
  //               alignItems='center'
  //               sx={{
  //                 '@media (max-width:910px)': { flexDirection: 'column' },
  //               }}
  //             >
  //               <Typography
  //                 color={'#A5A3AE'}
  //                 sx={{
  //                   '@media (max-width:911px)': { display: 'none' },
  //                   '@media (min-width:910px)': { display: 'block' },
  //                 }}
  //               >
  //                 {getFormattedTimeString(item.start)} - {getFormattedTimeString(item.end)}
  //               </Typography>
  //               {parseSubjectCategory(item.meta.summary) && (
  //                 <Typography
  //                   color={item.status === 'Verbal' ? 'primary' : '#FF9F43'}
  //                   bgcolor={item.status === 'Verbal' ? theme => theme.palette.primary.light : '#FFF0E1'}
  //                   p={2}
  //                   borderRadius={1}
  //                   // @ts-ignore
  //                   variant='paragraphSmall'
  //                 >
  //                   {parseSubjectCategory(item.meta.summary)}
  //                 </Typography>
  //               )}
  //               <Button variant='contained' color='primary' className='hidden-button' onClick={() => handleView(idx)}>
  //                 View
  //               </Button>
  //             </Box>
  //           </Box>
  //         ))}
  //         {/* <Box
  //           display='flex'
  //           justifyContent='space-between'
  //           alignItems='center'
  //           sx={{
  //             '@media (max-width:600px)': { flexDirection: 'column', alignItems: 'start', marginY: 2 },
  //           }}
  //         >
  //           <Typography sx={{ pl: 4 }}>Showing 1 to 7 out of 100 entries</Typography>
  //           <Pagination
  //             count={6}
  //             variant='text'
  //             shape='rounded'
  //             color='primary'
  //             // onClick={onClickPaginationBar}
  //             page={1}
  //             sx={{ p: 2 }}
  //           />
  //         </Box> */}
  //       </Box>
  //       {selectedCard && data && (
  //         <Box
  //           // @ts-ignore
  //           border={theme => theme.border}
  //           bgcolor='#F8F7FA'
  //           height={260}
  //           p={4}
  //           sx={{
  //             '@media (max-width:910px)': {
  //               position: 'fixed',
  //               bottom: 0,
  //               width: 'calc(100% - 33px)',
  //             },
  //             '@media (min-width:910px)': { width: '35%' },
  //             '@media (min-width:1500px)': { width: '25%' },
  //           }}
  //         >
  //           {/* @ts-ignore */}
  //           <Typography variant='h5' paddingBottom={2} borderBottom={theme => theme.border}>
  //             Class Information
  //           </Typography>
  //           <StyledBox>
  //             <Typography variant='h6'>Batch Name</Typography>
  //             <Typography className='truncate'>{data[selectedCard - 1].batchname}</Typography>
  //           </StyledBox>
  //           <StyledBox>
  //             <Typography variant='h6'>Date</Typography>
  //             <Typography>{getDayMonthAndYearFromTimestampWithFullMonth(getAdjustedDate(data[selectedCard - 1].start))}</Typography>
  //           </StyledBox>
  //           <StyledBox>
  //             <Typography variant='h6'>Subject</Typography>
  //             <Typography
  //               bgcolor={'#EBEBEE'}
  //               color={theme.palette.secondary.main}
  //               paddingY={1}
  //               paddingX={2}
  //               borderRadius={1}
  //             >
  //               {data[selectedCard - 1].status}
  //             </Typography>
  //           </StyledBox>
  //           <StyledBox>
  //             <Typography variant='h6'>Duration</Typography>
  //             <Typography>{`${getFormattedTimeString(data[selectedCard - 1].start)} - ${getFormattedTimeString(
  //               data[selectedCard - 1].end,
  //             )}`}</Typography>
  //           </StyledBox>
  //           <StyledBox gap={4}>
  //             <Button variant='tonal' fullWidth sx={{ mt: 2 }}>
  //               <Typography color='primary' mr={2}>
  //                 Recording
  //               </Typography>
  //               <Icon icon={'mingcute:unlink-line'} rotate={1} />
  //             </Button>
  //             <Button variant='tonal' fullWidth sx={{ mt: 2 }} onClick={() => setSelectedCard(null)}>
  //               <Typography color='secondary' mr={2}>
  //                 Close
  //               </Typography>
  //             </Button>
  //           </StyledBox>
  //         </Box>
  //       )}
  //     </Box>
  //   </Grid>
  // )
}

export default Recordings
