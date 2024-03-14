import { Navigate, Outlet } from 'react-router-dom'
import { useUserContext } from 'src/@core/context/UserContext'

function AuthenticatedRoute() {
  const { isUserLoggedIn, loading } = useUserContext()

  if (loading) return <p>Loading....</p>

  //   TODO: Add redirection logic back to the page.
  if (!isUserLoggedIn) return <Navigate to={'/auth/login'} />

  if (isUserLoggedIn) return <Outlet />
}

export default AuthenticatedRoute
