// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import React, { ErrorInfo, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'
import ThemeComponent from 'src/@core/theme/ThemeComponent'

import { Toaster } from 'react-hot-toast'

import 'react-perfect-scrollbar/dist/css/styles.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import UserProvider, { AxiosErrorWithErrorMessage } from 'src/@core/context/UserContext'
import AuthenticatedRoute from './@core/components/common/AuthenticatedRoute'
import './App.css'
import UserLayout from './layouts/UserLayout'

import { MathJaxContext } from 'better-react-mathjax'

const NotFound = React.lazy(() => import('./pages/NotFound'))
const Account = React.lazy(() => import('./pages/app/account'))
const AWAPages = React.lazy(() => import('./pages/app/awa'))
const ContactAdminPage = React.lazy(() => import('./pages/app/contact-admin'))
const AppointmentPage = React.lazy(() => import('./pages/appointment'))
const RCTool = React.lazy(() => import('./pages/rc-tool'))
const RCTestPlayer = React.lazy(() => import('./pages/rc-tool/RCTestPlayer'))

const AdmissionPage = React.lazy(() => import('./pages/admission-services'))
const LoginV2 = React.lazy(() => import('./pages/login'))
const ResetPassword = React.lazy(() => import('./pages/reset-password'))
const ForgetPassword = React.lazy(() => import('./pages/forgot-password'))

const Notes = React.lazy(() => import('./pages/notes'))
const Ebook = React.lazy(() => import('./pages/ebook'))
const QuizPlayer = React.lazy(() => import('./pages/quiz-player'))

const TwoStepsVerification = React.lazy(() => import('./pages/two-steps-verification'))
const StructurePage = React.lazy(() => import('./pages/structure'))

const ExpandedLearnPage = React.lazy(() => import('./pages/expanded-learn'))

const CustomQuiz = React.lazy(() => import('./pages/quiz'))
const CreateCustomQuizBuilder = React.lazy(() => import('./pages/custom-quiz-builder'))

const ReadingMaterial = React.lazy(() => import('./pages/reading-material'))
const RegisterV2 = React.lazy(() => import('./pages/register'))
const IFrame = React.lazy(() => import('./pages/iframe'))
const ClassPage = React.lazy(() => import('./pages/class'))
const TermsAndConditions = React.lazy(() => import('./pages/termsAndConditions'))
const PlannerPage = React.lazy(() => import('./pages/planner'))
const CourseSelectionPage = React.lazy(() => import('./pages/course-selection'))
const PracticePastAttempts = React.lazy(() => import('./pages/practice-past-attempts'))
const SummaryPage = React.lazy(() => import('./pages/summary'))
const AnalyticsPage = React.lazy(() => import('./pages/analytics'))

import { ErrorBoundary } from 'react-error-boundary'
import FallbackSpinner from './@core/components/common/Spinner'
import { showAPIErrorAsToast } from './@core/utils/ApiHelpers'
import Error500 from './pages/500'
import Dashboard from './pages/dashboard'

export function wrapRouteWithSuspense(Component: React.LazyExoticComponent<() => JSX.Element | null>) {
  return <Suspense fallback={<FallbackSpinner />}>{<Component />}</Suspense>
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      // @ts-ignore
      onError: (err: AxiosErrorWithErrorMessage<any>) => {
        showAPIErrorAsToast(import.meta.env.DEV ? { errorMessage: err.config?.url + ' ' + err.message } : err)
      },
    },
    mutations: {
      // @ts-ignore
      onError: (err: AxiosErrorWithErrorMessage<any>) => {
        showAPIErrorAsToast(import.meta.env.DEV ? { errorMessage: err.config?.url + ' ' + err.message } : err)
      },
    },
  },
})

function fallbackRender({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return <Error500 devError={error.message} resetErrorBoundry={resetErrorBoundary} />
}

const logError = (error: Error, info: ErrorInfo) => {
  console.error(error)
  console.error(info)
  // Do something with the error, e.g. log to an external API
}

function App() {
  useEffect(() => {
    if (document.body.style && "zoom" in document.body.style)
      document.body.style.zoom = 0.8;
  }, []);
  return (
    <ErrorBoundary fallbackRender={fallbackRender} onError={logError}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <MathJaxContext>
          <UserProvider>
            <SettingsProvider>
              <SettingsConsumer>
                {({ settings }) => {
                  return (
                    <ThemeComponent settings={settings}>
                      {/* <RouterProvider router={router} /> */}
                      <Routes>
                        <Route path='/auth/login' element={wrapRouteWithSuspense(LoginV2)} />
                        <Route path='/auth/register' element={wrapRouteWithSuspense(RegisterV2)} />
                        <Route path='/auth/reset' element={wrapRouteWithSuspense(ResetPassword)} />
                        <Route path='/auth/forgot' element={wrapRouteWithSuspense(ForgetPassword)} />
                        <Route path='/auth/verify' element={wrapRouteWithSuspense(TwoStepsVerification)} />
                        <Route path='/pages/terms' element={wrapRouteWithSuspense(TermsAndConditions)} />

                        <Route element={<AuthenticatedRoute />}>
                          <Route path='/app/test/view/:testID' element={wrapRouteWithSuspense(QuizPlayer)} />
                          <Route path='/app/practice/view/:testID' element={wrapRouteWithSuspense(QuizPlayer)} />
                          <Route path='/app/custom-test-player' element={wrapRouteWithSuspense(QuizPlayer)} />
                          <Route element={<UserLayout />}>
                            {/* TODO: Extract Routes as constants */}
                            <Route path='/' element={<Navigate to='/app' />} />
                            <Route path='/app' element={<Dashboard />} />
                            <Route path='/pages' element={<Navigate to='/app' />} />
                            <Route path='/app/analytics' element={<Navigate to='/app/analytics/analytic' />} />
                            {/* {RouteWithSuspense({ path: '/app/account/appointment/:tabId', element: <AppointmentPage /> })} */}
                            <Route path='/course' element={wrapRouteWithSuspense(CourseSelectionPage)} />
                            <Route
                              path='/app/account/appointment'
                              element={<Navigate to='/app/account/appointment/create' />}
                            />
                            <Route
                              path='/app/account/appointment/:tabId'
                              element={wrapRouteWithSuspense(AppointmentPage)}
                            />
                            <Route path='/app/planner' element={wrapRouteWithSuspense(PlannerPage)} />
                            <Route path='/app/account' element={<Navigate to='/app/account/account' />} />
                            <Route path='/app/account/:tabId' element={wrapRouteWithSuspense(Account)} />
                            <Route path='/app/notes' element={wrapRouteWithSuspense(Notes)} />
                            <Route path='/app/admission-services' element={wrapRouteWithSuspense(AdmissionPage)} />
                            <Route path='/app/contact-admin' element={wrapRouteWithSuspense(ContactAdminPage)} />
                            <Route path='/app/rctool' element={wrapRouteWithSuspense(RCTool)} />
                            <Route path='/app/gmatawatip' element={wrapRouteWithSuspense(IFrame)} />
                            <Route path='/app/sampleessay' element={wrapRouteWithSuspense(IFrame)} />
                            <Route path='/app/gmat-post-class-plan' element={wrapRouteWithSuspense(IFrame)} />
                            <Route path='/app/awa' element={<Navigate to='/app/awa/submit' />} />
                            <Route path='/app/awa/:tabId' element={wrapRouteWithSuspense(AWAPages)} />
                            <Route path='/app/rctool/:taskId' element={wrapRouteWithSuspense(RCTestPlayer)} />
                            <Route path='/app/ebook/:id' element={wrapRouteWithSuspense(Ebook)} />
                            {/* <Route path='/practice-quiz-report' element={wrapRouteWithSuspense(PracticeQuizReport)} /> */}
                            <Route path='/app/structure' element={wrapRouteWithSuspense(StructurePage)} />
                            <Route
                              path='/app/learn/view/:id/:subsectionId'
                              element={wrapRouteWithSuspense(ExpandedLearnPage)}
                            />
                            <Route path='/app/learn/view/:id' element={wrapRouteWithSuspense(ExpandedLearnPage)} />
                            <Route path='/pages/quiz' element={wrapRouteWithSuspense(CustomQuiz)} />
                            <Route
                              path='/pages/quiz/customised-quiz'
                              element={wrapRouteWithSuspense(CreateCustomQuizBuilder)}
                            />
                            <Route path='/app/analytics/:tabId' element={wrapRouteWithSuspense(AnalyticsPage)} />
                            {/* Test Summary Routes */}
                            <Route path='/app/test/summary/:attemptID' element={wrapRouteWithSuspense(SummaryPage)} />
                            <Route
                              path='/app/practice/summary/:attemptID'
                              element={wrapRouteWithSuspense(SummaryPage)}
                            />
                            {/* Kaksha  */}
                            <Route path='/pages/quiz-summary' element={wrapRouteWithSuspense(SummaryPage)} />
                            {/* End Test Summary Routes */}
                            <Route path='/app/reading-material' element={wrapRouteWithSuspense(ReadingMaterial)} />
                            <Route path='/app/class' element={<Navigate to='/app/class/timeline' />} />
                            <Route path='/app/class/:tabId' element={wrapRouteWithSuspense(ClassPage)} />
                            <Route
                              path='/app/practice/past-attempt'
                              element={wrapRouteWithSuspense(PracticePastAttempts)}
                            />
                            <Route
                              path='/app/test/past-attempt'
                              element={wrapRouteWithSuspense(PracticePastAttempts)}
                            />
                          </Route>
                        </Route>
                        <Route path='*' element={<NotFound />} />
                      </Routes>

                      <Toaster position='top-right' />

                      {/* <div>
                <a href="https://vitejs.dev" target="_blank">
                  <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                  <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
              </div>
              <h1>Vite + React</h1>
              <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                  count is {count}
                </button>
                <p>
                  Edit <code>src/App.tsx</code> and save to test HMR
                </p>
              </div>
              <p className="read-the-docs">
                Click on the Vite and React logos to learn more
              </p> */}
                      {/* <ReactHotToast>
                      <Toaster position={settings.toastPosition} toastOptions={{ className: 'react-hot-toast' }} />
                    </ReactHotToast> */}
                    </ThemeComponent>
                  )
                }}
              </SettingsConsumer>
            </SettingsProvider>
          </UserProvider>
        </MathJaxContext>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
