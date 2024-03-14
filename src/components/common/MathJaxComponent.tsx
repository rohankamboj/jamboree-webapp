import { MathJax } from 'better-react-mathjax'

// TODO: get styles from props
const CustomMathJax = ({ option }: { option: string }) => {
  return <MathJax dangerouslySetInnerHTML={{ __html: option }} />
}

export default CustomMathJax
