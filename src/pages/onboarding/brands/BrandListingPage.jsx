import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Chip, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

const API_URL = "https://register-sandbox.ascri.be/api/v2/registrations/tcr/tendlc/brands?page=1&per_page=10&sort=name&dir=asc";
const AUTH_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjQyOTQ5NjcyOTUsImlhdCI6MCwib3JnIjoxMzk5MywicGVyIjoiIn0.-V5yHzMwpFYKViDPCxTAODNzUIybPtmrb2-Iw6-zLfI";

const columns = [
  { id: 'name', label: 'Brand Name' },
  { id: 'legal_name', label: 'Legal Name' },
  { id: 'registration_status', label: 'Status' },
  { id: 'website', label: 'Website' },
  { id: 'contact', label: 'Contact' },
  { id: 'created_at', label: 'Created At' },
  { id: 'actions', label: 'Actions' },
];

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString();
}

const statusColor = (status) => {
  switch (status) {
    case 'Created': return 'info';
    case 'ExternalReviewApproved': return 'success';
    case 'Rejected': return 'error';
    default: return 'default';
  }
};

const BrandListingPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBrands() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API_URL, {
          headers: {
            'accept': 'application/json',
            'authorization': `Bearer ${AUTH_TOKEN}`,
            'x-volt-api-version': '2.0.0',
          },
        });
        const data = await res.json();
        setBrands(data.data || []);
      } catch (err) {
        setError('Failed to fetch brands');
      }
      setLoading(false);
    }
    fetchBrands();
  }, []);

  return (
    <Box sx={{ minWidth: 1180, maxWidth: 1180, mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Brands</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/onboarding/brands/register')} sx={{ fontWeight: 600, boxShadow: 1 }}>
          + Add Brand
        </Button>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: '#efe811' }}>
                {columns.map(col => (
                  <TableCell key={col.id} sx={{ fontWeight: 700 }}>{col.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {brands.map((brand) => (
                <TableRow key={brand.id} hover>
                  <TableCell>{brand.item.name}</TableCell>
                  <TableCell>{brand.item.legal_name}</TableCell>
                  <TableCell>
                    <Chip label={brand.item.registration_status} color={statusColor(brand.item.registration_status)} size="small" />
                  </TableCell>
                  <TableCell>
                    <a href={brand.item.website} target="_blank" rel="noopener noreferrer" style={{ color: '#000', textDecoration: 'underline' }}>{brand.item.website}</a>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>{brand.item.contact_first_name} {brand.item.contact_last_name}</Typography>
                      <Typography variant="body2">{brand.item.contact_email}</Typography>
                      <Typography variant="body2">{brand.item.contact_phone}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{formatDate(brand.item.created_at)}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Tooltip title="Update Brand">
                        <IconButton
                          size="small"
                          sx={{ bgcolor: '#e3f2fd', color: '#1976d2', '&:hover': { bgcolor: '#bbdefb' } }}
                          onClick={() => {navigate(`/onboarding/brands/register?brand_id=${brand.id}&update=true`)}}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Create Campaign">
                        <IconButton
                          size="small"
                          sx={{ bgcolor: '#fffde7', color: '#fbc02d', '&:hover': { bgcolor: '#fff9c4' } }}
                          onClick={() => {navigate(`/onboarding/campaigns/register?brand_id=${brand.id}`)}}
                        >
                          <AddCircleOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default BrandListingPage;