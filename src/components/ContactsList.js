import React, { useState } from 'react';
import Fuse from 'fuse.js';
//components
import ContactRow from './ContactRow';
import AddContact from './AddContact';
import FilterContacts from './FilterContacts';

// material ui
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
// graph ql
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

export const GET_CONTACTS = gql`
  query GetContacts {
    contacts {
      id
      firstName
      lastName
      phone
      email
    }
  }
`;

const options = {
  shouldSort: true,
  minMatchCharLength: 3,
  location: 0,
  threshold: 0.6,
  distance: 100,
  keys: ['firstName', 'lastName', 'phone', 'email'],
};

const ContactsList = () => {
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');
  const initUser = {
    id: null,
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  };
  const [user, setUser] = useState(initUser);
  const { loading, error, data } = useQuery(GET_CONTACTS);

  if (error) {
    return <div>Error</div>;
  }

  if (loading) {
    return (
      <div style={{ marginTop: 150 }}>
        <CircularProgress />
      </div>
    );
  }

  if (data) {
    // Fuse js Fuzzy search
    const fuse = new Fuse(data.contacts, options);
    const results = fuse.search(query);

    // If no query return original contacts othewise return filtered results from fuse
    const contactsList =
      query.length > 2 ? results.map((res) => res.item) : data.contacts;

    // If contacts list is not empty
    if (data.contacts.length > 0) {
      return (
        <div style={{ margin: '0 auto', padding: 5, maxWidth: 650 }}>
          {message !== '' && (
            <Alert
              severity='success'
              style={{
                position: 'fixed',
                width: 400,
                margin: '0 auto',
                top: 20,
                left: '33%',
                zIndex: 1101,
              }}
            >
              {message}
            </Alert>
          )}
          <TableContainer component={Paper}>
            <Grid
              container
              direction='row'
              justify='space-around'
              alignItems='center'
              style={{ width: '95%', marginLeft: '15px' }}
            >
              <Grid item zeroMinWidth xs={12} sm={6} align='left'>
                <h1>Contacts</h1>
              </Grid>
              <Grid item zeroMinWidth xs={12} sm={6} align='right'>
                <AddContact setMessage={setMessage} />
              </Grid>
            </Grid>
            <FilterContacts query={query} setQuery={setQuery} data={data} />
            <Table aria-label='contacts-table'>
              <TableBody>
                <ContactRow
                  setMessage={setMessage}
                  query={query}
                  contactsList={contactsList}
                />
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      );
    }
  }
};

export default ContactsList;
