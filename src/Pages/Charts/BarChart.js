import React, { useState } from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField'; 

function App() {
  const [checked, setChecked] = useState(false);
  const defaultvalu = 'fsegsgsgeg'
  const [inputValue, setInputValue] = useState(defaultvalu);
  const handleCheckboxChange = (event) => {
    setChecked(event.target.checked);
    if (!event.target.checked) {
      setInputValue('');
    }else{
      setInputValue(defaultvalu);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div>
      <FormControlLabel
        control={<Checkbox checked={checked} onChange={handleCheckboxChange} />}
        label="Disable Input Field"
      />
      <TextField
        disabled={checked}
        value={inputValue}
        onChange={handleInputChange}
        label="Input Field"
        variant="outlined"
        style={{ marginTop: '10px' }}
      />
    </div>
  );
}

export default App;
