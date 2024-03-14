import ReactDOM from 'react-dom'
import FallbackSpinner from './Spinner'

const TranslucentLoader = () => {
  // Instead of rendering here. we should create a portal on the root of the app
  const loader = (
    <div
      style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(174, 174, 174, 0.456)',
        zIndex: 9999,
        cursor: 'not-allowed',
      }}
    >
      <FallbackSpinner />
    </div>
  )

  const portalRoot = document?.getElementById('portal-root')
  if (portalRoot) {
    return ReactDOM.createPortal(loader, portalRoot)
  }
}

export default TranslucentLoader
