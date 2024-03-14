import { Helmet, HelmetProvider } from 'react-helmet-async'
type Props = {
  title: string
}
const CustomHelmet = (props: Props) => {
  const { title } = props
  return (
    <HelmetProvider>
      <Helmet>
        <title>{`${title} | Jamboree Education`}</title>
      </Helmet>
    </HelmetProvider>
  )
}

export default CustomHelmet
