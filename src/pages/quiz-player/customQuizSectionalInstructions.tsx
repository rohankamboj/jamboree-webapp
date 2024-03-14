import { Box } from '@mui/material'
import Typography from 'src/@core/components/common/Typography'
import { InfoWithIcon } from '.'

export function getStaticInstructionsForCustomTest(section: string) {
  if (section.toLowerCase() === 'verbal') {
    return `
        <p>There are two types of questions in the Verbal section: critical reasoning and reading comprehension.</p>
        <p>For each question, select the best answer of the choices given.</p>
        <p>
          Each of the <strong>critical reasoning</strong> questions is based on a short argument, a set of statements,
          or a plan of action.
        </p>
        <p>
          Each of the <strong>reading comprehension</strong> questions is based on the content of a passage. After
          reading the passage, answer all questions pertaining to It on the basis of what is stated or implied in the
          passage.
        </p>
      </>
    `
  }
  if (section.toLowerCase() === 'quant') {
    return `<p>In the Quantitative section, there are one type of question: problem solving.</p>
        <p>
          For each <strong>problem solving</strong> question, solve the problem and select the best of the answer
          choices given.
        </p>
        <ul>
          <li>
            Statement (1) ALONE is sufficient, but statement (2) alone is not sufficient to answer the question asked.
          </li>
          <li>
            Statement (2) ALONE is sufficient, but statement (1) alone is not sufficient to answer the question asked.
          </li>
          <li>
            BOTH statements (1) and (2) TOGETHER are sufficient to answer the question asked, but NEITHER statement
            ALONE is sufficient to answer the question asked.
          </li>
          <li>EACH statement ALONE is sufficient to answer the question asked.</li>
          <li>
            Statements (1) and (2) TOGETHER are NOT sufficient to answer the question asked, and additional data
            specific to the problem are needed.
          </li>
        </ul>
        <p>
          For <strong>all</strong> questions in the Quantitative section you may assume the following.
        </p>
        <p>
          <u>Numbers:</u> All numbers used are real numbers.
        </p>
        <p>
          <u>Figures:</u>
        </p>
        <ul>
          <li>
            For problem solving questions, figures are drawn as accurately as possible. Exceptions will be clearly
            noted.
          </li>
          <li>Lines shown as straight are straight, and lines that appear jagged are also straight.</li>
          <li>
            The positions of points, angles, regions, etc., exist in the ordler shown, and angle measures are greater
            than zero.
          </li>
          <li>All figures lie in a plane unless otherwise indicated.</li>
        </ul>
    `
  }
  if (section.toLowerCase() === 'data insights') {
    return `
      <p>
          In the Data Insights section, there are four type of questions: problem solving, multi source reasoning, two
          part analysis and graphs and tables.
        </p>

        <p>
          Each <strong>data sufficiency</strong> problem consists of a question and two statements, labeled (1) and (2),
          which contain certain data. Using these data and your knowledge of mathematics and everyday facts (such as the
          number of days in July or the meaning of the word <em>counterclockwise</em>), decide whether the data given
          are sufficient for answering the question and then select one of the following answer choices:
        </p>
        <p>
          <u>Note:</u> In data sufficiency problems that ask for the value of a quantity, the data given in the
          statements are sufficient only when it is possible to determine exactly one numerical value for the quantity.
        </p>
        <ul>
          <li>
            For data sufficiency questions, figures conform to the information given in the question, but will not
            necessarily conform to the additional information given in statements (1) and (2).
          </li>
          <li>Lines shown as straight are straight, and lines that appear jagged are also straight.</li>
          <li>
            The positions of points, angles, regions, etc., exist in the ordler shown, and angle measures are greater
            than zero.
          </li>
          <li>All figures lie in a plane unless otherwise indicated.</li>
        </ul>
    `
  }
  return `No instructions available for this section. ${section}`
}

export function CustomQuizSectionalInstructions({
  createMeta,
  currentCustomQuizSection,
  // handleStartCurrentQuizSection,
  instructionText,
}: {
  createMeta: CustomAndPersonalizedQuizFilters
  currentCustomQuizSection: CustomQuizSectionWithQuestionsMeta
  handleStartCurrentQuizSection?: any
  instructionText: string
}) {
  return (
    <Box>
      <Typography variant='h2'>{createMeta.quizname}</Typography>
      <Typography variant='h3'>{currentCustomQuizSection.section}</Typography>
      <Box display='flex' alignItems='center' width='100%' my={6}>
        <InfoWithIcon
          icon={'tabler:notes'}
          title={(currentCustomQuizSection?.questions?.length || 'NA').toString()}
          description={'Number of questions'}
        />
        <InfoWithIcon
          icon={'mdi:clock-outline'}
          title={`${currentCustomQuizSection.section_time} Minutes`}
          description={'Duration'}
        />
      </Box>
      {/* @ts-ignore */}
      <Typography
        variant='paragraph'
        dangerouslySetInnerHTML={{
          __html: instructionText,
        }}
      ></Typography>
      {/*<Box bgcolor='#F8F8F8' padding={4} borderRadius={1} mt={10}>
         <Typography variant='paragraph'>
          You can view explanations of the format of the specific questions while answering items in this section by
          clicking on HELP.
        </Typography> */}
      {/* <Box display='flex' alignItems='center' gap={2} my={2}>
          <Typography variant='paragraph'>Click</Typography>
          <Button variant='contained' color='primary' onClick={handleStartCurrentQuizSection}>
            Next
          </Button>
          <Typography variant='paragraph'>to continue</Typography>
        </Box> 
      </Box>*/}
    </Box>
  )
}
