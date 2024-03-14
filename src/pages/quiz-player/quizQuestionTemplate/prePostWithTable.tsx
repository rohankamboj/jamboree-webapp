import MathJaxComponent from 'src/components/common/MathJaxComponent'
import { extractQuestionPrePostAndOptionsType } from '../helpers'
import { useLayoutEffect } from 'react'

export const PrePostWithTable = ({ question }: { question: extractQuestionPrePostAndOptionsType }) => {
  return (
    <>
      <MathJaxComponent option={question?.pre || 'NA'} />
      {question?.table && <Table tableData={question?.table} />}
      <MathJaxComponent option={question?.post || 'NA'} />
    </>
  )
}

const Table = ({
  tableData,
}: {
  tableData: {
    head: {
      span: number
      label: string
    }[][]
    body: string[][]
  }
}) => {
  // Generate table from the tableData variable using head and body.
  const { head, body } = tableData

  useLayoutEffect(() => {
    const style = document.createElement('style')
    style.id = 'tableStyles'
    style.textContent = `
      .bordered-table {
        border-collapse: collapse;
      }
      .bordered-table th, .bordered-table td {
        border: 1px solid black;
        padding: 10px;
      }
    `
    document.head.appendChild(style)

    return () => {
      const styleElement = document.getElementById('tableStyles')
      if (styleElement) document.head.removeChild(styleElement)
    }
  }, [])

  return (
    <table className='bordered-table'>
      <thead>
        {head.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <th key={cellIndex} colSpan={cell.span}>
                <div dangerouslySetInnerHTML={{ __html: cell.label }} />
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {body.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
