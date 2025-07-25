import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Chip, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const API_URL = "https://register-sandbox.ascri.be/api/v2/registrations/tcr/tendlc/campaigns?page=1&per_page=10&sort=description&dir=asc";
const AUTH_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjQyOTQ5NjcyOTUsImlhdCI6MCwib3JnIjoxMzk5MywicGVyIjoiIn0.-V5yHzMwpFYKViDPCxTAODNzUIybPtmrb2-Iw6-zLfI";

const columns = [
  { id: 'description', label: 'Description' },
  { id: 'registration_status', label: 'Status' },
  { id: 'brand_registration_id', label: 'Brand ID' },
  { id: 'created_at', label: 'Created At' },
  { id: 'website', label: 'Website' },
  { id: 'message_flow', label: 'Message Flow' },
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

const CampaignListingPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchCampaigns() {
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
        setCampaigns(data.data || []);
      } catch (err) {
        setError('Failed to fetch campaigns');
      }
      setLoading(false);
    }
    fetchCampaigns();
  }, []);

  return (
    <Box sx={{ minWidth: 1100, maxWidth: 1100, mx: 'auto', mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Campaigns</Typography>
        <Button variant="contained" color="primary" onClick={() => navigate('/onboarding/campaigns/register')} sx={{ fontWeight: 600, boxShadow: 1 }}>
          + Add Campaign
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
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id} hover>
                  <TableCell>{campaign.item.description}</TableCell>
                  <TableCell>
                    <Chip label={campaign.item.registration_status} color={statusColor(campaign.item.registration_status)} size="small" />
                  </TableCell>
                  <TableCell>{campaign.item.brand_registration_id}</TableCell>
                  <TableCell>{formatDate(campaign.item.created_at)}</TableCell>
                  <TableCell>
                    {campaign.item.website ? (
                      <a href={campaign.item.website.startsWith('http') ? campaign.item.website : `https://${campaign.item.website}`} target="_blank" rel="noopener noreferrer" style={{ color: '#000', textDecoration: 'underline' }}>{campaign.item.website}</a>
                    ) : ''}
                  </TableCell>
                  <TableCell>{campaign.item.message_flow}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default CampaignListingPage; 