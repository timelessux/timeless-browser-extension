import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { store } from './redux/store'

import './app.scss'
import './fonts/Poppins-Regular.ttf'
import './fonts/Poppins-SemiBold.ttf'
import './fonts/SF-Pro-Rounded-Bold.otf'
import './fonts/SF-Pro-Rounded-Heavy.otf'
import './fonts/SF-Pro-Rounded-Regular.otf'
import './fonts/SF-Pro-Rounded-Semibold.otf'
import './fonts/Silkscreen-Bold.ttf'
import './fonts/Silkscreen-Regular.ttf'
import { Provider } from 'react-redux'
import { AppProvider } from './context/AppContext'
import '@rainbow-me/rainbowkit/styles.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppProvider>
        <App />
      </AppProvider>
    </Provider>
  </React.StrictMode>
)
