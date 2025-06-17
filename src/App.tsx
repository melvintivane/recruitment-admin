import AppProvidersWrapper from './components/wrappers/AppProvidersWrapper'
import configureFakeBackend from './helpers/fake-backend'
import AppRouter from './routes/router'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'
import '@/assets/scss/app.scss'

configureFakeBackend()

const App = () => {
  return (
    <AppProvidersWrapper>
      <AppRouter />
      <ToastContainer position="top-right" autoClose={3000} />
    </AppProvidersWrapper>
  )
}

export default App
