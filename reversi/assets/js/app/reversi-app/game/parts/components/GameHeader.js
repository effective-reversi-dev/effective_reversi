import React from 'react';
import PropTypes from 'prop-types';

import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import ExitToApp from '@material-ui/icons/ExitToApp';
import MenuIcon from '@material-ui/icons/Menu';

const GameHeader = props => {
  return (
    <div className="layout-header-wrapper">
      <AppBar position="static" color="default">
        <Toolbar>
          <Grid container justify="space-between" spacing={0}>
            <IconButton onClick={() => props.handleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">Effective-Reversi</Typography>
            <IconButton onClick={() => props.handleExitDialog(true)}>
              <ExitToApp />
            </IconButton>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
};

GameHeader.propTypes = {
  handleDrawer: PropTypes.func.isRequired,
  handleExitDialog: PropTypes.func.isRequired
};

export default GameHeader;
