import React from 'react';
import MyLayout from './game-components/MyLayout';

import AppBar from '@material-ui/core/AppBar';
import ExitToApp from '@material-ui/icons/ExitToApp';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

class App extends React.Component {
    render() {
        return(
            <div className='App'>
                <AppBar position='static' color='default'>
                    <Toolbar>
                        <Grid container justify='space-between' spacing={24}>
                            <IconButton>
                                <MenuIcon />
                            </IconButton>
                            <Typography variant='h6'>
                               Effective-Reversi
                            </Typography>
                            <IconButton>
                                <ExitToApp />
                            </IconButton>
                        </Grid>
                    </Toolbar>
                </AppBar>
                <MyLayout/>
            </div>
        );
    }
}

export default App;
