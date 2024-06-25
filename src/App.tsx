import './App.css'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Link, Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';

import Stacks from './Stacks'
import ServiceUi from './Service'
import Services from './Services'

function App() {

  const baseUrl = 'http://localhost:4173/api/v1.45/'

  const theme = createTheme({
    palette: {
      primary: {
        main: '#3f51b5',
      },
      secondary: {
        main: '#f50057',
      },
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <div id="navbar" className="sidebar">
          <ul>
            <li>Stacks</li>
            <li><Link to="/services">Services</Link></li>
            <li>Tasks</li>
            <li>Nodes</li>
            <li>Networks</li>
            <li>Secrets</li>
            <li>Configs</li>
          </ul>
        </div>
        <div className="content">
          <Routes>
            <Route path='/stacks' element={<Stacks baseUrl={baseUrl} />}></Route>
            <Route path='/service/:id' element={<ServiceUi baseUrl={baseUrl} />}></Route>
            <Route index path='/services' element={<Services baseUrl={baseUrl} />}></Route>
            <Route path="*" element={<Navigate to="/services" replace={true} />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
