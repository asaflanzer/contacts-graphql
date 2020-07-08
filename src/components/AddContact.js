import React, { useState, useEffect } from 'react';
// material ui
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// graph ql
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { GET_CONTACTS } from './ContactsList';

const ADD_CONTACT = gql`
  mutation AddContact(
    $firstName: String!
    $lastName: String!
    $phone: String
    $email: String
  ) {
    addContact(
      firstName: $firstName
      lastName: $lastName
      phone: $phone
      email: $email
    ) {
      id
      firstName
      lastName
      phone
      email
    }
  }
`;

const AddContact = (props) => {
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const { setMessage } = props;

  const [addContact] = useMutation(ADD_CONTACT, {
    update(cache, { data: { addContact } }) {
      try {
        const { contacts } = cache.readQuery({ query: GET_CONTACTS });
        cache.writeQuery({
          query: GET_CONTACTS,
          data: { contacts: contacts.concat([addContact]) },
        });
      } catch (error) {
        console.log(error);
      }
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (firstName && lastName !== '') {
      setDisabled(false);
    } else setDisabled(true);
  }, [firstName, lastName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    addContact({
      variables: {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
      },
    });
    setMessage('User added successfully.');
    setTimeout(() => {
      setMessage('');
    }, 3000);

    resetForm();
    handleClose();
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
  };

  return (
    <div>
      <Button variant='outlined' color='primary' onClick={handleClickOpen}>
        New
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <form id='add-contact-form' autoComplete='off' onSubmit={handleSubmit}>
          <DialogTitle id='form-dialog-title' style={{ textAlign: 'center' }}>
            New Contact
          </DialogTitle>
          <DialogContent>
            <div style={{ width: 300, margin: '0 auto', padding: '5px 40px' }}>
              <DialogContentText>
                Please fill in the contacts details below.
              </DialogContentText>

              <TextField
                autoFocus
                required
                margin='normal'
                id='firstName'
                label='First Name'
                type='text'
                fullWidth
                variant='outlined'
                color='primary'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                required
                margin='normal'
                id='lastName'
                label='Last Name'
                type='text'
                fullWidth
                variant='outlined'
                color='primary'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <TextField
                margin='normal'
                id='phone'
                label='Phone Number'
                type='text'
                fullWidth
                variant='outlined'
                color='primary'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <TextField
                margin='normal'
                id='email'
                label='Email Address'
                type='email'
                fullWidth
                variant='outlined'
                color='primary'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions style={{ margin: '0 10px 10px 0' }}>
            <Button onClick={handleClose} color='primary'>
              Cancel
            </Button>
            <Button
              type='submit'
              onClick={handleSubmit}
              variant='outlined'
              color='primary'
              disabled={disabled}
            >
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default AddContact;

//graph ql playground

// mutation AddContact{
//   addContact(
//     firstName: "Asaf"
//     lastName: "lanzer"
//     phone: "123"
//     email: "test"
//   ) {
//     firstName
//     lastName
//     phone
//     email
//   }
// }
