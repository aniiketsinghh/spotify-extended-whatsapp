
import { Route, Routes } from 'react-router'
import HomePage from './pages/home/HomePage'
import AuthCallbackPage from './pages/auth-callback/AuthCallbackPage'
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react'
import MainLayout from './layout/MainLayout'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl={"/auth-callback"} />} />

        <Route path="/auth-callback" element={<AuthCallbackPage/>}/>
       <Route element={<MainLayout/>}>
         <Route path="/" element={<HomePage/>}/>
         </Route>
      
      </Routes>


    </>
  )
}

export default App
