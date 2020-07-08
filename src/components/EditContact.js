import React, { useState, useEffect } from 'react';
// material ui
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
// icons
import MoreVertIcon from '@material-ui/icons/MoreVert';
// graph ql
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { GET_CONTACTS } from './ContactsList';

const UPDATE_CONTACT = gql`
  mutation UpdateContact(
    $id: ID!
    $firstName: String!
    $lastName: String!
    $phone: String
    $email: String
  ) {
    updateContact(
      id: $id
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

const DELETE_CONTACT = gql`
  mutation DeleteContact($id: ID!) {
    deleteContact(id: $id) {
      id
    }
  }
`;

const EditContact = ({ setMessage, id, firstName, lastName, phone, email }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [editFirstName, setEditFirstName] = useState(firstName);
  const [editLastName, setEditLastName] = useState(lastName);
  const [editPhone, setEditPhone] = useState(phone);
  const [editEmail, setEditEmail] = useState(email);

  const [updateContact] = useMutation(UPDATE_CONTACT, {
    variables: {
      id: id,
      firstName: editFirstName,
      lastName: editLastName,
      phone: editPhone,
      email: editEmail,
    },
    update: (cache) => {
      const { contacts } = cache.readQuery({ query: GET_CONTACTS });
      cache.writeQuery({
        query: GET_CONTACTS,
        data: { contacts: contacts },
      });
    },
  });

  const [deleteContact] = useMutation(DELETE_CONTACT, {
    variables: { id: id },
    update: (cache) => {
      const { contacts } = cache.readQuery({ query: GET_CONTACTS });
      cache.writeQuery({
        query: GET_CONTACTS,
        data: { contacts: contacts.filter((e) => e.id !== id) },
      });
    },
  });

  useEffect(() => {
    if (editFirstName && editLastName !== '') {
      setDisabled(false);
    } else setDisabled(true);
  }, [editFirstName, editLastName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateContact();
    setMessage('User updated successfully.');
    setTimeout(() => {
      setMessage('');
    }, 3000);

    resetForm();
    handleCloseEdit();
  };

  const resetForm = () => {
    setEditFirstName('');
    setEditLastName('');
    setEditPhone('');
    setEditEmail('');
  };

  const handleClickOpenEdit = () => {
    setOpenEdit(true);
  };
  const handleClickOpenDelete = () => {
    setOpenDelete(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleConfirmDelete = () => {
    deleteContact();
    handleCloseDelete();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls='simple-menu'
        aria-haspopup='true'
        onClick={handleClick}
      >
        <MoreVertIcon />
      </Button>
      <Menu
        id='simple-menu'
        elevation={0}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        PaperProps={{
          style: {
            height: '100px',
            width: '100px',
            border: '1px solid #e0e0e0',
            margin: '5px 10px',
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            handleClickOpenEdit();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseMenu();
            handleClickOpenDelete();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Delete Contact</DialogTitle>
        <DialogContent style={{ padding: '10px 20px 10px 25px' }}>
          <DialogContentText id='alert-dialog-description'>
            Delete this contact permanently?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} color='default'>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant='outlined'
            color='primary'
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby='form-dialog-title'
      >
        <form id='add-contact-form' autoComplete='off' onSubmit={handleSubmit}>
          <DialogTitle id='form-dialog-title' style={{ textAlign: 'center' }}>
            Edit Contact
          </DialogTitle>
          <DialogContent>
            <div style={{ width: 300, margin: '0 auto', padding: '5px 40px' }}>
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
                value={editFirstName}
                onChange={(e) => setEditFirstName(e.target.value)}
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
                value={editLastName}
                onChange={(e) => setEditLastName(e.target.value)}
              />
              <TextField
                margin='normal'
                id='phone'
                label='Phone Number'
                type='text'
                fullWidth
                variant='outlined'
                color='primary'
                value={editPhone ? editPhone : ''}
                onChange={(e) => setEditPhone(e.target.value)}
              />
              <TextField
                margin='normal'
                id='email'
                label='Email Address'
                type='email'
                fullWidth
                variant='outlined'
                color='primary'
                value={editEmail ? editEmail : ''}
                onChange={(e) => setEditEmail(e.target.value)}
              />
            </div>
          </DialogContent>
          <DialogActions style={{ margin: '0 10px 10px 0' }}>
            <Button onClick={handleCloseEdit} color='primary'>
              Cancel
            </Button>
            <Button
              type='submit'
              onClick={handleSubmit}
              variant='outlined'
              color='primary'
              disabled={disabled}
            >
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default EditContact;

//graph ql playground

// mutation DeleteContact {
//   deleteContact(id: 15){
//     id
//   }
// }

// mutation UpdateContact{
//   updateContact(
//     id: 15
//     firstName: "Asaf"
//     lastName: "lanzer"
//     phone: "123"
//     email: "test"
//   ) {
//     id
//     firstName
//     lastName
//     phone
//     email
//   }
// }
