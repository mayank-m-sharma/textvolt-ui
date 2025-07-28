import * as React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, Box, Toolbar, AppBar, createTheme, ThemeProvider, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import About from './pages/About';
import TestPage1 from './pages/TestPage1';
import Analytics from './pages/Analytics';
import Sidebar from './components/Sidebar';
import "./App.css"
import { NAV_PRIMARY } from './constants/sidebarNavList';
import BrandListingPage from './pages/onboarding/brands/BrandListingPage.jsx'
import BrandRegister from './pages/onboarding/brands/BrandRegister.jsx';
import CampaignListingPage from './pages/onboarding/campaigns/CampaignListingPage.jsx';
import CampaignRegister from './pages/onboarding/campaigns/CampaignRegister.jsx';
import NumberSelector from './components/NumberSelector.jsx';


const theme = createTheme({
  palette: {
    background: { default: '#fff' },
    primary: { main: '#efe811' },
    text: { primary: '#000' },
  },
  typography: {
    fontFamily: "'Poppins', system-ui, Avenir, Helvetica, Arial, sans-serif",
    allVariants: { color: '#000' },
  },
});

function App() {

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="fixed" sx={{ paddingY: "10px", zIndex: (theme) => theme.zIndex.drawer + 1, background: '#fff', color: '#000', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', px: 2 }}>
            <img className='logoImage' src='https://app.textvolt.com/static/media/rf_logo.19267a56.svg' />
            <NumberSelector />
          </AppBar>
          <Sidebar navItems={NAV_PRIMARY}/>
          <Box component="main" sx={{ flexGrow: 1, bgcolor: '#fff', p: 3, minHeight: '100vh' }}>
            <Toolbar />
            <Routes>
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/onboarding/brands" element={<BrandListingPage />} />
              <Route path="/onboarding/brands/register" element={<BrandRegister />} />
              <Route path="/onboarding/campaigns" element={<CampaignListingPage />} />
              <Route path="/onboarding/campaigns/register" element={<CampaignRegister />} />
              <Route path="/" element={<Navigate to="/analytics" replace />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
