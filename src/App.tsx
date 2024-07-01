import './App.css'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Link, Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { PaletteMode, Typography } from '@mui/material';
import { useState, useMemo } from 'react'

import ServiceUi from './Service'
import NetworkUi from './Network'

import Services from './Services'
import Stacks from './Stacks'
import Tasks from './Tasks'
import Nodes from './Nodes'
import Networks from './Networks'
import Secrets from './Secrets'
import Configs from './Configs'
import Box from '@mui/material/Box';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

function App() {

  const baseUrl = 'http://localhost:4173/api/v1.45/'

  const [title, setTitle] = useState('Swarm View')

  const [mode, setMode] = useState<PaletteMode>(() => {
    const storedValue = localStorage.getItem('theme')
    return storedValue === 'dark' ? 'dark' : 'light'
  })

  const theme = useMemo(() => {
    const thm = (mode === 'light' ?
      createTheme({
        palette: {
          mode: 'light',
          background: {
            default: '#ddd'
            , paper: '#f8f8f8'
          }
        }
  
      })
      :
      createTheme({
        palette: {
          mode: 'dark'
          , primary: {
            main: '#1976d2'
          }
        }
      })
    )
    console.log("Theme:", thm)
    return thm
  }
    , [mode]);

  function updateMode(mode: PaletteMode) {
    setMode(mode)
    localStorage.setItem('theme', mode);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box id="navbar" className="sidebar" borderRight='2px solid' borderColor="gray" >
          <Box sx={{ padding: '2px' }}>
            <Typography variant='h6'>Swarm View</Typography>
            <Typography variant='body2'>Version 0.0.0</Typography>
          </Box>
          <ul>
            <li><Link to="/stacks">Stacks</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/tasks">Tasks</Link></li>
            <li><Link to="/nodes">Nodes</Link></li>
            <li><Link to="/networks">Networks</Link></li>
            <li><Link to="/secrets">Secrets</Link></li>
            <li><Link to="/configs">Configs</Link></li>
          </ul>
        </Box>
        <Box className='notSideBar'>
          <Box className='titleBar' bgcolor='primary.main' width='100%' sx={{ boxShadow: 3 }} >
            <Typography variant='h4'>{title}</Typography>
            <Box>
              {mode === 'light' ? (
                <DarkModeIcon className='modeChange' onClick={() => { updateMode('dark') }}></DarkModeIcon>
              ) : (
                <LightModeIcon className='modeChange' onClick={() => { updateMode('light') }}></LightModeIcon>
              )}
            </Box>
          </Box>
          <Box className="content">
            <Routes>
              <Route path='/stacks' element={<Stacks baseUrl={baseUrl} setTitle={setTitle} />}></Route>
              <Route path='/service/:id' element={<ServiceUi baseUrl={baseUrl} setTitle={setTitle} />}></Route>
              <Route path='/network/:id' element={<NetworkUi baseUrl={baseUrl} setTitle={setTitle} />}></Route>
              <Route index path='/services' element={<Services baseUrl={baseUrl} setTitle={setTitle} />}></Route>
              <Route index path='/stacks' element={<Stacks baseUrl={baseUrl} setTitle={setTitle} />}></Route>
              <Route index path='/tasks' element={<Tasks baseUrl={baseUrl} setTitle={setTitle} />}></Route>
              <Route index path='/nodes' element={<Nodes baseUrl={baseUrl} setTitle={setTitle} />}></Route>
              <Route index path='/networks' element={<Networks baseUrl={baseUrl} setTitle={setTitle} />}></Route>
              <Route index path='/secrets' element={<Secrets baseUrl={baseUrl} setTitle={setTitle} />}></Route>
              <Route index path='/configs' element={<Configs baseUrl={baseUrl} setTitle={setTitle} />}></Route>
              <Route path="*" element={<Navigate to="/services" replace={true} />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
