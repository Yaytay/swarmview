import './App.css'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter, Link, Routes, Route, Navigate } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import { useState, useMemo, useEffect } from 'react'

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
import CachedIcon from '@mui/icons-material/Cached';
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
import Version from './Version';
import Stack from '@mui/material/Stack';
import { PaletteMode } from '@mui/material';
import { DockerApi } from './DockerApi';
import { enqueueSnackbar, SnackbarProvider } from 'notistack';
import { Dimensions } from './app-types';

const heightOffset = 128
const widthOffset = 180

function App() {

  const baseUrl = ''

  const [title, setTitle] = useState('Swarm View')
  const [maxSize, setMaxSize] = useState<Dimensions>({ height: window.innerHeight - heightOffset, width: window.innerWidth - widthOffset })

  const [mode, setMode] = useState<PaletteMode>(() => {
    const storedValue = localStorage.getItem('theme')
    return storedValue === 'dark' ? 'dark' : 'light'
  })

  function apiErrorHandler(err: string) {
    enqueueSnackbar(err, { variant: 'error' })
  }

  const dockerApi = useMemo(() => new DockerApi(baseUrl, apiErrorHandler), [baseUrl])

  const [lastUpdate, setLastUpdate] = useState<Date>(dockerApi.lastUpdated())

  useEffect(() => {
    const handleResize = () => {
      const sz = { height: window.innerHeight - heightOffset, width: window.innerWidth - widthOffset }
      console.log('Recording max size as', sz)
      setMaxSize(sz)
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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

  function refreshCache() {
    dockerApi.clearCache()
    setLastUpdate(dockerApi.lastUpdated())
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box id="navbar" className="sidebar" borderRight='2px solid' borderColor="gray" sx={{ height: '100%' }}>
          <Box sx={{ padding: '2px' }}>
            <Typography variant='h6'>Swarm View</Typography>
            <Typography variant='body2'>Version <Version /></Typography>
          </Box>
          <hr />
          <Box>
            <Link className='navlink' to="/stacks"><Stack alignItems="center" direction="row" spacing={1} paddingLeft={1}><LayersIcon fontSize='small' /><Typography>Stacks</Typography></Stack></Link>
            <Link className='navlink' to="/services"><Stack alignItems="center" direction="row" spacing={1} paddingLeft={1} ><MiscellaneousServicesIcon fontSize='small' /><Typography>Services</Typography></Stack></Link>
            <Link className='navlink' to="/tasks"><Stack alignItems="center" direction="row" spacing={1} paddingLeft={1} ><AssignmentIcon fontSize='small' /><Typography>Tasks</Typography></Stack></Link>
            <hr />
            <Link className='navlink' to="/nodes"><Stack alignItems="center" direction="row" spacing={1} paddingLeft={1} ><HubIcon fontSize='small' /><Typography>Nodes</Typography></Stack></Link>
            <Link className='navlink' to="/networks"><Stack alignItems="center" direction="row" spacing={1} paddingLeft={1} ><WifiIcon fontSize='small' /><Typography>Networks</Typography></Stack></Link>
            <hr />
            <Link className='navlink' to="/configs"><Stack alignItems="center" direction="row" spacing={1} paddingLeft={1} ><DisplaySettingsIcon fontSize='small' /><Typography>Configs</Typography></Stack></Link>
            <Link className='navlink' to="/secrets"><Stack alignItems="center" direction="row" spacing={1} paddingLeft={1} ><KeyIcon fontSize='small' /><Typography>Secrets</Typography></Stack></Link>
          </Box>
          <Box sx={{ position: 'absolute', bottom: 0 }}>
            <Typography fontSize={'8pt'} padding='2px'>
              Data last updated:<br />{lastUpdate.toISOString()}
            </Typography>
          </Box>
        </Box>
        <Box className='notSideBar'>
          <Box className='titleBar' bgcolor='primary.main' width='100%' sx={{ display: 'flex' }} >
            <Typography variant='h4' flexGrow={1}>{title}</Typography>
            <Box>
              <CachedIcon onClick={() => { refreshCache() }} ></CachedIcon>
              {mode === 'light' ? (
                <DarkModeIcon onClick={() => { updateMode('dark') }}></DarkModeIcon>
              ) : (
                <LightModeIcon onClick={() => { updateMode('light') }}></LightModeIcon>
              )}
            </Box>
          </Box>
          <Box className="content" sx={{ height: '100%' }}>
            <Routes>
              <Route path='/stacks' element={<Stacks baseUrl={baseUrl} setTitle={setTitle} docker={dockerApi} refresh={lastUpdate} maxSize={maxSize} />}></Route>
              <Route path='/stack/:id' element={<StackUi baseUrl={baseUrl} setTitle={setTitle} docker={dockerApi} refresh={lastUpdate} />}></Route>
              <Route path='/service/:id' element={<ServiceUi baseUrl={baseUrl} setTitle={setTitle} docker={dockerApi} refresh={lastUpdate} />}></Route>
              <Route path='/network/:id' element={<NetworkUi baseUrl={baseUrl} setTitle={setTitle} docker={dockerApi} refresh={lastUpdate} />}></Route>
              <Route path='/node/:id' element={<NodeUi baseUrl={baseUrl} setTitle={setTitle} docker={dockerApi} refresh={lastUpdate} />}></Route>
              <Route path='/task/:id' element={<TaskUi baseUrl={baseUrl} setTitle={setTitle} docker={dockerApi} refresh={lastUpdate} />}></Route>
              <Route path='/secret/:id' element={<SecretUi baseUrl={baseUrl} setTitle={setTitle} docker={dockerApi} refresh={lastUpdate} />}></Route>
              <Route path='/config/:id' element={<ConfigUi baseUrl={baseUrl} setTitle={setTitle} docker={dockerApi} refresh={lastUpdate} />}></Route>
              <Route index path='/services' element={<Services baseUrl={baseUrl} setTitle={setTitle} docker={dockerApi} refresh={lastUpdate} maxSize={maxSize} />}></Route>
              <Route index path='/stacks' element={<Stacks baseUrl={baseUrl} setTitle={setTitle} docker={dockerApi} refresh={lastUpdate} maxSize={maxSize} />}></Route>
              <Route index path='/tasks' element={<Tasks baseUrl={baseUrl} setTitle={setTitle} docker={dockerApi} refresh={lastUpdate} maxSize={maxSize} />}></Route>
              <Route index path='/nodes' element={<Nodes baseUrl={baseUrl} setTitle={setTitle} docker={dockerApi} refresh={lastUpdate} />}></Route>
              <Route index path='/networks' element={<Networks baseUrl={baseUrl} setTitle={setTitle} docker={dockerApi} refresh={lastUpdate} />}></Route>
              <Route index path='/secrets' element={<Secrets baseUrl={baseUrl} setTitle={setTitle} docker={dockerApi} refresh={lastUpdate} />}></Route>
              <Route index path='/configs' element={<Configs baseUrl={baseUrl} setTitle={setTitle} docker={dockerApi} refresh={lastUpdate} />}></Route>
              <Route path="*" element={<Navigate to="/services" replace={true} />} />
            </Routes>
          </Box>
          <SnackbarProvider autoHideDuration={10000} />
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App


