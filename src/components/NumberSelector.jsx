import React from 'react'
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

const NumberSelector = () => {
  const usNumbers = [
    '+12109647879',
  ];
  const [searchParams, setSearchParams] = useSearchParams();
  const paramNumber = searchParams.get('selected_number');
  const initialNumber = usNumbers.includes(paramNumber) ? paramNumber : usNumbers[0];
  const [selectedNumber, setSelectedNumber] = React.useState(initialNumber);

  // On mount: ensure URL param is set to a valid value
  React.useEffect(() => {
    if (!paramNumber || !usNumbers.includes(paramNumber)) {
      searchParams.set('selected_number', usNumbers[0]);
      setSearchParams(searchParams, { replace: true });
    }
  }, []); // eslint-disable-line

  // When user changes selection, update state and URL param
  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedNumber(value);
    searchParams.set('selected_number', value);
    setSearchParams(searchParams, { replace: true });
  };

  return (
    <>
      <FormControl size="small" sx={{ minWidth: 180, background: '#f5f5f5', borderRadius: 1 }}>
        <InputLabel id="us-number-label">Number</InputLabel>
        <Select
          labelId="us-number-label"
          value={selectedNumber}
          label="Number"
          onChange={handleChange}
        >
          {usNumbers.map((num) => (
            <MenuItem key={num} value={num}>{num}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  )
}

export default NumberSelector