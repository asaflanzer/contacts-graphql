import React from 'react';
//components
import EditContact from './EditContact';
// marterial ui
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';

const ContactRow = (props) => {
  const { setMessage, contactsList } = props;
  return (
    <>
      {contactsList.length === 0 ? (
        <TableRow>
          <TableCell>No search results found...</TableCell>
        </TableRow>
      ) : (
        contactsList.map(({ id, firstName, lastName, phone, email }) => (
          <TableRow key={id}>
            <TableCell>
              {email ? (
                <Avatar
                  alt={`${firstName} ${lastName}`}
                  src={`https://api.adorable.io/avatar/${email}`}
                />
              ) : (
                <Avatar
                  alt={`${firstName} ${lastName}`}
                  src='https://api.adorable.io/avatars/face/eyes4/nose3/mouth7/8e8895'
                />
              )}
            </TableCell>
            <TableCell align='left'>
              {firstName} {lastName}
            </TableCell>
            {phone && email ? (
              <>
                <TableCell align='right'>
                  <Button variant='contained' href={`tel:${phone}`}>
                    Call
                  </Button>
                </TableCell>
                <TableCell align='right'>
                  <Button variant='contained' href={`mailto:${email}`}>
                    Email
                  </Button>
                </TableCell>
              </>
            ) : phone ? (
              <>
                <TableCell />
                <TableCell align='right'>
                  <Button variant='contained' href={`tel:${phone}`}>
                    Call
                  </Button>
                </TableCell>
              </>
            ) : email ? (
              <>
                <TableCell />
                <TableCell align='right'>
                  <Button variant='contained' href={`mailto:${email}`}>
                    Email
                  </Button>
                </TableCell>
              </>
            ) : (
              <>
                <TableCell />
                <TableCell />
              </>
            )}
            <TableCell>
              <EditContact
                setMessage={setMessage}
                id={id}
                firstName={firstName}
                lastName={lastName}
                phone={phone}
                email={email}
              />
            </TableCell>
          </TableRow>
        ))
      )}
    </>
  );
};

export default ContactRow;
