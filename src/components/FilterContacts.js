import React from 'react';
// material ui
import TextField from '@material-ui/core/TextField';

const FilterContacts = (props) => {
  const { query, setQuery } = props;

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  return (
    <div>
      <TextField
        id='search-contacts'
        label='Search'
        style={{ width: '95%' }}
        value={query}
        onChange={handleSearch}
      />
    </div>
  );
};
export default FilterContacts;
