import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import ExitToApp from '@material-ui/icons/ExitToApp';
import MenuIcon from '@material-ui/icons/Menu';

class GameHeader extends React.Component {
  render() {
    return (
      <div className="layout-header-wrapper">
        <AppBar position="static" color="default">
          <Toolbar>
            <Grid container justify="space-between" spacing={24}>
              <IconButton onClick={() => this.props.handleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6">Effective-Reversi</Typography>
              <IconButton onClick={() => this.props.handleExitDialog(true)}>
                <ExitToApp />
              </IconButton>
            </Grid>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default GameHeader;
