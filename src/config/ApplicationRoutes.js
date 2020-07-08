import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
// components
import ContactsList from '../components/ContactsList';
// material ui
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';

const ApplicationRoutes = (props) => {
  return (
    <Router>
      <AppBar style={{ padding: 15 }}>
        <Typography variant='h4' component='h4'>
          Contacts Graphql
        </Typography>
      </AppBar>
      <Container
        maxWidth='md'
        style={{
          margin: '45px auto',
          padding: 25,
          background: '#fff',
        }}
      >
        <Switch>
          <Route path='/contacts' component={ContactsList} />
          <Redirect to='/contacts' from='/' />
        </Switch>
      </Container>
    </Router>
  );
};

export default ApplicationRoutes;
