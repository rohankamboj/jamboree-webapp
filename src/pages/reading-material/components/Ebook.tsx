import { useQuery } from 'react-query'
import { get } from 'src/@core/utils/request'
import { GET_EBOOK_API } from 'src/apis/user'

type Props = {
  stringifiedEbookData: string
}

type EbookPage = {
  EbookId: number
  PageNo: number
}

function parseEbookData(data: string) {
  try {
    return JSON.parse(data) as Array<EbookPage>
  } catch (e) {
    return null
  }
}

function Ebook({ stringifiedEbookData }: Props) {
  const ebookData = parseEbookData(stringifiedEbookData)
  const ebookPages = ebookData?.map(ebook => <EbookPageContent key={ebook.EbookId + ebook.PageNo} ebookPage={ebook} />)

  return <div>{ebookPages}</div>
}

export default Ebook

function EbookPageContent({ ebookPage }: { ebookPage: EbookPage }) {
  const ebookPageContentQuery = useQuery({
    queryKey: ['ebookPage', ebookPage.PageNo, ebookPage.EbookId],
    queryFn: () =>
      get(GET_EBOOK_API + ebookPage.EbookId, {
        queryParams: { type: 'ebookPage', page: ebookPage.PageNo.toString(), count: 'true' },
      }) as Promise<{ page: Array<{ content: string }> }>,
  })
  if (ebookPageContentQuery.isLoading) return ''

  return ebookPageContentQuery.data?.page[0].content ? (
    <span dangerouslySetInnerHTML={{ __html: ebookPageContentQuery.data?.page[0].content?.toString() + '<hr/>' }} />
  ) : (
    <h6>
      EbookId: {ebookPage.EbookId} Page: {ebookPage.PageNo} <br /> Content Not found
    </h6>
  )
}
