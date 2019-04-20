import React from 'react';
import PropTypes from 'prop-types';

import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { withStyles } from '@material-ui/styles';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Info from '@material-ui/icons/Info';
import Games from '@material-ui/icons/Games';
import Message from '@material-ui/icons/Message';
import OutlinedFlag from '@material-ui/icons/OutlinedFlag';

const styles = () => ({
  chevronButton: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
});

class GameDrawer extends React.Component {
  onAddPanel(text) {
    // do nothing when the clicked panel is already open
    const { panelsOpen } = this.props;
    if (panelsOpen[text] === false) {
      this.props.onAddPanel(text);
    }
  }

  render() {
    return (
      <Drawer anchor="left" open={this.props.isOpenDrawer} variant="persistent">
        <div className={this.props.classes.chevronButton}>
          <IconButton onClick={() => this.props.handleDrawer(false)}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {Object.keys(this.props.panelsOpen).map((text, index) => {
            const getIcon = idx => {
              switch (idx) {
                case 0:
                  return <Info />;
                case 1:
                  return <Games />;
                case 2:
                  return <OutlinedFlag />;
                case 3:
                  return <Message />;
                default:
                  return null;
              }
            };
            return (
              <ListItem button key={text} onClick={() => this.onAddPanel(text)}>
                <ListItemIcon>{getIcon(index)}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    );
  }
}

GameDrawer.propTypes = {
  panelsOpen: PropTypes.shape({
    情報: PropTypes.bool.isRequired,
    ゲーム画面: PropTypes.bool.isRequired,
    戦況: PropTypes.bool.isRequired,
    チャット: PropTypes.bool.isRequired
  }).isRequired,
  classes: PropTypes.shape({
    chevronButton: PropTypes.string.isRequired
  }).isRequired,
  onAddPanel: PropTypes.func.isRequired,
  isOpenDrawer: PropTypes.bool.isRequired,
  handleDrawer: PropTypes.func.isRequired
};

export default withStyles(styles)(GameDrawer);
