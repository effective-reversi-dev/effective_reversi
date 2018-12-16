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

const styles = theme => ({
    chevronButton: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
});

class GameDrawer extends React.Component {
    _switchIcon(index){
        switch(index){
            case 0:
                return <Info />
            case 1:
                return <Games />
            case 2:
                return <OutlinedFlag />
            case 3:
                return <Message />
            default:
                return;
        }
    }

    render() {
        const { classes } = this.props;
        return(
            <Drawer
                anchor="left" open={this.props.isOpenDrawer}
                variant='persistent'
            >
                <div className={classes.chevronButton}>
                    <IconButton onClick={()=>this.props.handleDrawer(false)}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {['exampleA', 'exampleB', 'exampleC', 'exampleD'].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon>{this._switchIcon(index)}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        );
    }
}

GameDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
}
export default withStyles(styles)(GameDrawer);
