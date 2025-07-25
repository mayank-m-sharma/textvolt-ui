import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Typography, TextField, Autocomplete, CircularProgress, Stepper, Step, StepLabel, Fade, Alert, Chip } from '@mui/material';
import { LIST_USE_CASES, LIST_COUNTRIES } from '../helpers/tendlcApi';
import { useSearchParams } from 'react-router-dom';

const BRANDS_API_URL = "https://register-sandbox.ascri.be/api/v2/registrations/tcr/tendlc/brands?page=1&per_page=10&sort=name&dir=asc";
const AUTH_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjQyOTQ5NjcyOTUsImlhdCI6MCwib3JnIjoxMzk5MywicGVyIjoiIn0.-V5yHzMwpFYKViDPCxTAODNzUIybPtmrb2-Iw6-zLfI";

const initialForm = {
  brand: null,
  useCase: null,
  description: '',
  messageFlow: '',
  website: '',
  ageGatedContent: false,
  directLending: false,
  embeddedLinkSample: '',
  embeddedPhoneNumber: false,
  preferredAreaCode: '',
  privacyPolicyLink: '',
  termsAndConditionsLink: '',
  sampleMessage1: '',
  sampleMessage2: '',
  sampleMessage3: '',
  sampleMessage4: '',
  sampleMessage5: '',
  tags: [],
  subUsecases: [],
};
const textFieldVariant = "standard"
const steps = [
  'Select Brand',
  'Campaign Details',
];

const API_BASE = "https://register-sandbox.ascri.be/api/v2/registrations/tcr/tendlc/brands";

export default function CampaignRegister() {
  const [form, setForm] = useState(initialForm);
  const [brands, setBrands] = useState([]);
  const [useCases, setUseCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [stepFade, setStepFade] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [createdCampaign, setCreatedCampaign] = useState(null);
  const [searchParams] = useSearchParams();
  const brandIdFromQuery = searchParams.get('brand_id');

  useEffect(() => {
    async function fetchLists() {
      setLoading(true);
      const [brandsRes, useCasesRes] = await Promise.all([
        fetch(BRANDS_API_URL, {
          headers: {
            'accept': 'application/json',
            'authorization': `Bearer ${AUTH_TOKEN}`,
            'x-volt-api-version': '2.0.0',
          },
        }).then(r => r.json()),
        LIST_USE_CASES(),
      ]);
      setBrands((brandsRes.data || []));
      setUseCases(useCasesRes || []);
      // If brand_id is in query, set the brand in form and skip to step 1
      if (brandIdFromQuery && brandsRes.data) {
        const foundBrand = brandsRes.data.find(b => b.id === brandIdFromQuery);
        if (foundBrand) {
          setForm(f => ({ ...f, brand: foundBrand }));
          setActiveStep(1);
        }
      }
      setLoading(false);
    }
    fetchLists();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAutoChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleNext = () => {
    setStepFade(false);
    setTimeout(() => {
      setActiveStep((prev) => prev + 1);
      setStepFade(true);
    }, 200);
  };

  const handleBack = () => {
    setStepFade(false);
    setTimeout(() => {
      setActiveStep((prev) => prev - 1);
      setStepFade(true);
    }, 200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    if (!form.brand?.id) {
      setError('Please select a brand.');
      setSubmitting(false);
      return;
    }
    const payload = {
      age_gated_content: form.ageGatedContent,
      description: form.description,
      direct_lending_or_loan_arrangement: form.directLending,
      embedded_link_sample: form.embeddedLinkSample,
      embedded_phone_number: form.embeddedPhoneNumber,
      message_flow: form.messageFlow,
      preferred_area_code: form.preferredAreaCode ? Number(form.preferredAreaCode) : undefined,
      privacy_policy_link: form.privacyPolicyLink,
      sample_message_1: form.sampleMessage1,
      sample_message_2: form.sampleMessage2,
      sample_message_3: form.sampleMessage3,
      sample_message_4: form.sampleMessage4,
      sample_message_5: form.sampleMessage5,
      sub_usecases: form.subUsecases.map(u => u.id),
      tags: form.tags,
      terms_and_conditions_link: form.termsAndConditionsLink,
      use_case_id: form.useCase?.id,
      website: form.website,
    };
    try {
      const res = await fetch(`${API_BASE}/${form.brand.id}/campaigns`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'authorization': AUTH_TOKEN,
          'content-type': 'application/json',
          'x-volt-api-version': '2.0.0',
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create campaign');
      const data = await res.json();
      setCreatedCampaign(data.data);
      setSuccess(true);
    } catch (err) {
      setError('Failed to create campaign. Please check your input and try again.');
    }
    setSubmitting(false);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: "center", mt: 8 }}><CircularProgress /> Loading...</Box>;
  if (success && createdCampaign) {
    return (
      <Box sx={{ minHeight: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mx: 'auto' }}>
        <Card sx={{ width: 500, p: 4, textAlign: 'center', bgcolor: '#f9fbe7', border: '2px solid #efe811' }}>
          <Typography variant="h5" color="success.main" mb={2}>Campaign Created Successfully!</Typography>
          <Typography variant="h6" mb={1}>{createdCampaign.item?.description}</Typography>
          <Typography variant="body1" mb={2}>Status: {createdCampaign.item?.registration_status}</Typography>
          <Button variant="contained" color="primary" href="/onboarding/campaigns">Back to Campaigns List</Button>
        </Card>
      </Box>
    );
  }

  // Step 0: Select Brand
  const selectBrandStep = (
    <Box display="flex" flexDirection="column" gap={3}>
      <Autocomplete
        options={brands}
        getOptionLabel={option => option.item?.name || ''}
        value={form.brand}
        onChange={(_, value) => handleAutoChange('brand', value)}
        renderInput={params => <TextField variant={textFieldVariant} {...params} label="Select Brand" required />}
      />
    </Box>
  );

  // Step 1: Campaign Details
  const campaignDetailsStep = (
    <Box display="flex" flexDirection="column" gap={3}>
      <Autocomplete
        options={useCases}
        getOptionLabel={option => option.display_name || option.name || ''}
        value={form.useCase}
        onChange={(_, value) => handleAutoChange('useCase', value)}
        renderInput={params => <TextField variant={textFieldVariant} {...params} label="Use Case" required />}
      />
      <TextField variant={textFieldVariant} label="Description" name="description" value={form.description} onChange={handleChange} fullWidth required multiline minRows={2} />
      <TextField variant={textFieldVariant} label="Message Flow" name="messageFlow" value={form.messageFlow} onChange={handleChange} fullWidth required multiline minRows={2} />
      <TextField variant={textFieldVariant} label="Website" name="website" value={form.website} onChange={handleChange} fullWidth required />
      <TextField variant={textFieldVariant} label="Sample Message 1" name="sampleMessage1" value={form.sampleMessage1} onChange={handleChange} fullWidth required />
      <TextField variant={textFieldVariant} label="Sample Message 2" name="sampleMessage2" value={form.sampleMessage2} onChange={handleChange} fullWidth required />
      <TextField variant={textFieldVariant} label="Sample Message 3" name="sampleMessage3" value={form.sampleMessage3} onChange={handleChange} fullWidth required />
      <TextField variant={textFieldVariant} label="Sample Message 4" name="sampleMessage4" value={form.sampleMessage4} onChange={handleChange} fullWidth />
      <TextField variant={textFieldVariant} label="Sample Message 5" name="sampleMessage5" value={form.sampleMessage5} onChange={handleChange} fullWidth />
      <TextField variant={textFieldVariant} label="Embedded Link Sample" name="embeddedLinkSample" value={form.embeddedLinkSample} onChange={handleChange} fullWidth />
      <TextField variant={textFieldVariant} label="Preferred Area Code" name="preferredAreaCode" value={form.preferredAreaCode} onChange={handleChange} fullWidth />
      <TextField variant={textFieldVariant} label="Privacy Policy Link" name="privacyPolicyLink" value={form.privacyPolicyLink} onChange={handleChange} fullWidth />
      <TextField variant={textFieldVariant} label="Terms & Conditions Link" name="termsAndConditionsLink" value={form.termsAndConditionsLink} onChange={handleChange} fullWidth />
      <Box display="flex" gap={2} alignItems="center">
        <Chip
          label={form.ageGatedContent ? 'Age Gated: Yes' : 'Age Gated: No'}
          color={form.ageGatedContent ? 'success' : 'default'}
          onClick={() => setForm(f => ({ ...f, ageGatedContent: !f.ageGatedContent }))}
        />
        <Chip
          label={form.directLending ? 'Direct Lending: Yes' : 'Direct Lending: No'}
          color={form.directLending ? 'success' : 'default'}
          onClick={() => setForm(f => ({ ...f, directLending: !f.directLending }))}
        />
        <Chip
          label={form.embeddedPhoneNumber ? 'Embedded Phone: Yes' : 'Embedded Phone: No'}
          color={form.embeddedPhoneNumber ? 'success' : 'default'}
          onClick={() => setForm(f => ({ ...f, embeddedPhoneNumber: !f.embeddedPhoneNumber }))}
        />
      </Box>
      {/* TODO: Add subUsecases and tags as needed */}
    </Box>
  );

  const stepFields = [selectBrandStep, campaignDetailsStep];

  return (
    <Box sx={{overflow:"hidden"}}>
      <Typography sx={{textAlign: "center"}} variant="h5" mb={1}>Register New Campaign</Typography>
      <Box sx={{ width: "70rem", minHeight: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mx: 'auto' }}>
        <Card sx={{ width: '700px', mb: 4, p: { xs: 1, sm: 2, md: 3 } }}>
          <CardContent>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <form onSubmit={handleSubmit} autoComplete="off">
              <Fade in={stepFade} timeout={300}>
                <Box sx={{}}>{stepFields[activeStep]}</Box>
              </Fade>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button disabled={activeStep === 0 || submitting} onClick={handleBack} variant="outlined">Back</Button>
                {activeStep < steps.length - 1 ? (
                  <Button onClick={handleNext} variant="contained" color="primary" disabled={submitting}>Next</Button>
                ) : (
                  <Button type="submit" variant="contained" color="primary" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</Button>
                )}
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
} 