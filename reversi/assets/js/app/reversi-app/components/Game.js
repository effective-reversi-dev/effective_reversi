import React from 'react';

import GameDrawer from '../containers/game-containers/GameDrawer';
import GameGoldenLayout from '../containers/game-containers/GameGoldenLayout';
import GameHeader from '../containers/game-containers/GameHeader';
import GameExitDialog from '../containers/game-containers/GameExitDialog';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenDrawer: false,
            isOpenExitDialog: false,
        }
        this.handleDrawer = this.handleDrawer.bind(this);
        this.handleExitDialog = this.handleExitDialog.bind(this);
    }

    handleDrawer(isOpenDrawer) {
        this.setState({isOpenDrawer: isOpenDrawer})
    }

    handleExitDialog(isOpenExitDialog) {
        this.setState({isOpenExitDialog: isOpenExitDialog})
    }

    render() {
        return(
            <React.Fragment>
                <GameHeader handleDrawer={this.handleDrawer} handleExitDialog={this.handleExitDialog} />
                <GameGoldenLayout />
                <GameDrawer 
                    handleDrawer={this.handleDrawer} 
                    isOpenDrawer={this.state.isOpenDrawer} />
                <GameExitDialog
                    handleExitDialog={this.handleExitDialog}
                    isOpenExitDialog={this.state.isOpenExitDialog} />
            </React.Fragment>
        );
    }
}

export default Game;
