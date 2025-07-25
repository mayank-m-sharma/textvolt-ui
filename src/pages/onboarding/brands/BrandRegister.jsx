import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Typography, TextField, Autocomplete, Divider, CircularProgress, Stepper, Step, StepLabel, Fade, Alert } from '@mui/material';
import { LIST_COUNTRIES, LIST_VERTICALS, LIST_STATES, LIST_ENTITY_TYPES, LIST_STOCK_EXCHANGES } from '../helpers/tendlcApi';
import { useSearchParams } from 'react-router-dom';

const initialForm = {
  website: '',
  legalName: '',
  businessName: '',
  type: '',
  ein: '',
  countryOfTaxId: null,
  vertical: null,
  businessAddress: '',
  city: '',
  state: null,
  postalCode: '',
  countryOfRegistration: null,
  entityType: null,
  stockExchange: null,
  stockSymbol: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  orgName: '',
};

const BRAND_TYPES = [
  { label: 'Private', value: 'private' },
  { label: 'Public', value: 'public' },
  { label: 'Nonprofit', value: 'nonprofit' },
];

const inputSx = {
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#000',
      borderWidth: 2,
    },
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#000',
  },
};

const steps = [
  'Brand Details',
  'Business Location',
  'Brand Contact Details',
];

const API_URL = "https://register-sandbox.ascri.be/api/v2/registrations/tcr/tendlc/brands";
const AUTH_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjQyOTQ5NjcyOTUsImlhdCI6MCwib3JnIjoxMzk5MywicGVyIjoiIn0.-V5yHzMwpFYKViDPCxTAODNzUIybPtmrb2-Iw6-zLfI";

export default function BrandRegister() {
  const [form, setForm] = useState(initialForm);
  const [countries, setCountries] = useState([]);
  const [verticals, setVerticals] = useState([]);
  const [states, setStates] = useState([]);
  const [entityTypes, setEntityTypes] = useState([]);
  const [stockExchanges, setStockExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [stepFade, setStepFade] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [createdBrand, setCreatedBrand] = useState(null);
  const [searchParams] = useSearchParams();
  const brandIdFromQuery = searchParams.get('brand_id');
  const isUpdate = searchParams.get('update') === 'true';

  useEffect(() => {
    async function fetchListsAndBrand() {
      setLoading(true);
      const [countriesRes, verticalsRes, statesRes, entityTypesRes, stockExchangesRes] = await Promise.all([
        LIST_COUNTRIES(),
        LIST_VERTICALS(),
        LIST_STATES(),
        LIST_ENTITY_TYPES(),
        LIST_STOCK_EXCHANGES(),
      ]);
      setCountries(countriesRes || []);
      setVerticals(verticalsRes || []);
      setStates(statesRes || []);
      setEntityTypes(entityTypesRes || []);
      setStockExchanges(stockExchangesRes || []);
      // If update and brand_id, fetch brand details and populate form
      if (isUpdate && brandIdFromQuery) {
        try {
          const res = await fetch(`${API_URL}/${brandIdFromQuery}`, {
            headers: {
              'accept': 'application/json',
              'authorization': `Bearer ${AUTH_TOKEN}`,
              'x-volt-api-version': '2.0.0',
            },
          });
          const data = await res.json();
          const item = data.data?.item;
          if (item) {
            setForm(f => ({
              ...f,
              website: item.website || '',
              legalName: item.legal_name || '',
              businessName: item.name || '',
              ein: item.ein || '',
              businessAddress: item.street || '',
              city: item.city || '',
              postalCode: item.post_code || '',
              stockSymbol: item.stock_symbol || '',
              firstName: item.contact_first_name || '',
              lastName: item.contact_last_name || '',
              email: item.contact_email || '',
              phone: item.contact_phone || '',
              orgName: item.contact_organization_name || '',
              countryOfTaxId: countriesRes?.find(c => c.id === item.ein_country_id) || null,
              countryOfRegistration: countriesRes?.find(c => c.id === item.country_id) || null,
              state: statesRes?.find(s => s.id === item.state_id) || null,
              vertical: verticalsRes?.find(v => v.id === item.vertical_id) || null,
              entityType: entityTypesRes?.find(e => e.id === item.entity_type_id) || null,
              stockExchange: stockExchangesRes?.find(se => se.id === item.stock_exchange_id) || null,
              type: '', // Not mapped
            }));
          }
        } catch (err) {
          setError('Failed to fetch brand details.');
        }
      }
      setLoading(false);
    }
    fetchListsAndBrand();
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
    const payload = {
      city: form.city,
      contact_email: form.email,
      contact_first_name: form.firstName,
      contact_last_name: form.lastName,
      contact_organization_name: form.orgName,
      contact_phone: form.phone,
      country_id: form.countryOfRegistration?.id,
      ein: form.ein,
      ein_country_id: form.countryOfTaxId?.id,
      entity_type_id: form.entityType?.id,
      legal_name: form.legalName,
      name: form.businessName,
      post_code: form.postalCode,
      state_id: form.state?.id,
      stock_exchange_id: form.stockExchange?.id || null,
      stock_symbol: form.stockSymbol || null,
      street: form.businessAddress,
      vertical_id: form.vertical?.id,
      website: form.website,
    };
    try {
      let res, data;
      if (isUpdate && brandIdFromQuery) {
        res = await fetch(`${API_URL}/${brandIdFromQuery}`, {
          method: 'PUT',
          headers: {
            'accept': 'application/json',
            'authorization': `Bearer ${AUTH_TOKEN}`,
            'content-type': 'application/json',
            'x-volt-api-version': '2.0.0',
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'authorization': `Bearer ${AUTH_TOKEN}`,
            'content-type': 'application/json',
            'x-volt-api-version': '2.0.0',
          },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error(isUpdate ? 'Failed to update brand' : 'Failed to create brand');
      data = await res.json();
      setCreatedBrand(data.data);
      setSuccess(true);
    } catch (err) {
      setError(isUpdate ? 'Failed to update brand. Please check your input and try again.' : 'Failed to create brand. Please check your input and try again.');
    }
    setSubmitting(false);
  };

  const textFieldVariant = "standard"
  const formTitle = isUpdate ? 'Update Brand' : 'Register New Brand';
  const submitButtonLabel = isUpdate ? (submitting ? 'Updating...' : 'Update') : (submitting ? 'Submitting...' : 'Submit');
  const successTitle = isUpdate ? 'Brand Updated Successfully!' : 'Brand Created Successfully!';

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: "center", mt: 8 }}><CircularProgress /></Box>;
  if (success && createdBrand) {
    return (
      <Box sx={{ minHeight: 'calc(100vh - 100px)', display: 'flex', width: "70vw", flexDirection: 'column', alignItems: 'center', justifyContent: 'center', mx: 'auto' }}>
        <Card sx={{ width: 500, p: 4, textAlign: 'center', bgcolor: '#f9fbe7', border: '2px solid #efe811' }}>
          <Typography variant="h5" color="success.main" mb={2}>{successTitle}</Typography>
          <Typography variant="h6" mb={1}>{createdBrand.item?.name}</Typography>
          <Typography variant="body1" mb={2}>Legal Name: {createdBrand.item?.legal_name}</Typography>
          <Typography variant="body2" mb={2}>Status: {createdBrand.item?.registration_status}</Typography>
          <Button variant="contained" color="primary" href="/onboarding/brands">Back to Brands List</Button>
        </Card>
      </Box>
    );
  }

  // Step 1: Brand Details
  const brandDetailsFields = (
    <Box display="flex" flexDirection="column" gap={3}>
      <TextField label="Website/Online Presence" name="website" value={form.website} onChange={handleChange} fullWidth required variant={textFieldVariant} sx={inputSx} placeholder="https://yourbrand.com" />
      <TextField label="Legal Company Name" name="legalName" value={form.legalName} onChange={handleChange} fullWidth required variant={textFieldVariant} sx={inputSx} />
      <TextField label="Business Name" name="businessName" value={form.businessName} onChange={handleChange} fullWidth required variant={textFieldVariant} sx={inputSx} placeholder="Customer-facing name" />
      <Autocomplete
        options={BRAND_TYPES}
        getOptionLabel={option => option.label}
        value={BRAND_TYPES.find(t => t.value === form.type) || null}
        onChange={(_, value) => handleAutoChange('type', value ? value.value : '')}
        renderInput={params => <TextField {...params} label="Type of Brand" required variant={textFieldVariant} sx={inputSx} />}
      />
      <TextField label="EIN or Tax ID" name="ein" value={form.ein} onChange={handleChange} fullWidth required variant={textFieldVariant} sx={inputSx} />
    </Box>
  );

  // Step 2: Business Location
  const businessLocationFields = (
    <Box display="flex" flexDirection="column" gap={3}>
      <Autocomplete
        options={countries}
        getOptionLabel={option => option.name || ''}
        value={form.countryOfTaxId}
        onChange={(_, value) => handleAutoChange('countryOfTaxId', value)}
        renderInput={params => <TextField {...params} label="Country of Tax ID" required variant={textFieldVariant} sx={inputSx} />}
      />
      <Autocomplete
        options={verticals}
        getOptionLabel={option => option.name || ''}
        value={form.vertical}
        onChange={(_, value) => handleAutoChange('vertical', value)}
        renderInput={params => <TextField {...params} label="Vertical Type" required variant={textFieldVariant} sx={inputSx} />}
      />
      <Autocomplete
        options={entityTypes}
        getOptionLabel={option => option.name || ''}
        value={form.entityType}
        onChange={(_, value) => handleAutoChange('entityType', value)}
        renderInput={params => <TextField {...params} label="Entity Type" required variant={textFieldVariant} sx={inputSx} />}
      />
      <Autocomplete
        options={stockExchanges}
        getOptionLabel={option => option.name || ''}
        value={form.stockExchange}
        onChange={(_, value) => handleAutoChange('stockExchange', value)}
        renderInput={params => <TextField {...params} label="Stock Exchange" variant={textFieldVariant} sx={inputSx} />}
      />
      <TextField label="Stock Symbol" name="stockSymbol" value={form.stockSymbol} onChange={handleChange} fullWidth variant={textFieldVariant} sx={inputSx} />
      <TextField label="Business Address" name="businessAddress" value={form.businessAddress} onChange={handleChange} fullWidth required variant={textFieldVariant} sx={inputSx} />
      <TextField label="City" name="city" value={form.city} onChange={handleChange} fullWidth required variant={textFieldVariant} sx={inputSx} />
      <Autocomplete
        options={states}
        getOptionLabel={option => option.name || ''}
        value={form.state}
        onChange={(_, value) => handleAutoChange('state', value)}
        renderInput={params => <TextField {...params} label="State/Province" required variant={textFieldVariant} sx={inputSx} />}
      />
      <TextField label="Postal/Zip Code" name="postalCode" value={form.postalCode} onChange={handleChange} fullWidth required variant={textFieldVariant} sx={inputSx} />
      <Autocomplete
        options={countries}
        getOptionLabel={option => option.name || ''}
        value={form.countryOfRegistration}
        onChange={(_, value) => handleAutoChange('countryOfRegistration', value)}
        renderInput={params => <TextField {...params} label="Country of Registration" required variant={textFieldVariant} sx={inputSx} />}
      />
    </Box>
  );

  // Step 3: Brand Contact Details
  const contactDetailsFields = (
    <Box display="flex" flexDirection="column" gap={3}>
      <TextField label="First Name" name="firstName" value={form.firstName} onChange={handleChange} fullWidth required variant={textFieldVariant} sx={inputSx} />
      <TextField label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} fullWidth required variant={textFieldVariant} sx={inputSx} />
      <TextField label="Email Address" name="email" value={form.email} onChange={handleChange} fullWidth required type="email" variant={textFieldVariant} sx={inputSx} />
      <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth required type="tel" variant={textFieldVariant} sx={inputSx} />
      <TextField label="Organization Name (Optional)" name="orgName" value={form.orgName} onChange={handleChange} fullWidth variant={textFieldVariant} sx={inputSx} />
    </Box>
  );

  const stepFields = [brandDetailsFields, businessLocationFields, contactDetailsFields];

  return (
   <Box sx={{overflow:"hidden"}}>
    <Typography sx={{textAlign: "center"}} variant="h5" mb={1}>{formTitle}</Typography>
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
                <Button type="submit" variant="contained" color="primary" disabled={submitting}>{submitButtonLabel}</Button>
              )}
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
   </Box>
  );
} 