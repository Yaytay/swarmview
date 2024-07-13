import './App.css'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Link, Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
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
import LayersIcon from '@mui/icons-material/Layers';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HubIcon from '@mui/icons-material/Hub';
import WifiIcon from '@mui/icons-material/Wifi';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';
import KeyIcon from '@mui/icons-material/Key';
import StackUi from './Stack';
import NodeUi from './Node';
import TaskUi from './Task';
import SecretUi from './Secret';
import ConfigUi from './Config';
import Stack from '@mui/system/Stack';
import { PaletteMode } from '@mui/material';

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

          <hr />
          <Box>
            <Link className='navlink' to="/stacks"><Stack alignItems="center" direction="row" spacing={1} paddingLeft={1}><LayersIcon fontSize='small' /><Typography>Stacks</Typography></Stack></Link>
            <Link className='navlink' to="/services"><Stack alignItems="center" direction="row" spacing={1} paddingLeft={1} ><MiscellaneousServicesIcon fontSize='small' /><Typography>Servcices</Typography></Stack></Link>
            <Link className='navlink' to="/tasks"><Stack alignItems="center" direction="row" spacing={1} paddingLeft={1} ><AssignmentIcon fontSize='small' /><Typography>Tasks</Typography></Stack></Link>
            <hr />
            <Link className='navlink' to="/nodes"><Stack alignItems="center" direction="row" spacing={1} paddingLeft={1} ><HubIcon fontSize='small' /><Typography>Nodes</Typography></Stack></Link>
            <Link className='navlink' to="/networks"><Stack alignItems="center" direction="row" spacing={1} paddingLeft={1} ><WifiIcon fontSize='small' /><Typography>Networks</Typography></Stack></Link>
            <hr />
            <Link className='navlink' to="/configs"><Stack alignItems="center" direction="row" spacing={1} paddingLeft={1} ><DisplaySettingsIcon fontSize='small' /><Typography>Configs</Typography></Stack></Link>
            <Link className='navlink' to="/secrets"><Stack alignItems="center" direction="row" spacing={1} paddingLeft={1} ><KeyIcon fontSize='small' /><Typography>Secrets</Typography></Stack></Link>
          </Box>
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
              <Route path='/stack/:id' element={<StackUi baseUrl={baseUrl} setTitle={setTitle} />}></Route>
              <Route path='/service/:id' element={<ServiceUi baseUrl={baseUrl} setTitle={setTitle} />}></Route>
              <Route path='/network/:id' element={<NetworkUi baseUrl={baseUrl} setTitle={setTitle} />}></Route>
              <Route path='/node/:id' element={<NodeUi baseUrl={baseUrl} setTitle={setTitle} />}></Route>
              <Route path='/task/:id' element={<TaskUi baseUrl={baseUrl} setTitle={setTitle} />}></Route>
              <Route path='/secret/:id' element={<SecretUi baseUrl={baseUrl} setTitle={setTitle} />}></Route>
              <Route path='/config/:id' element={<ConfigUi baseUrl={baseUrl} setTitle={setTitle} />}></Route>
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
