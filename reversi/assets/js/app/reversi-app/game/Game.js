import React from 'react';

import GameDrawer from './parts/containers/GameDrawer';
import GameGoldenLayout from './parts/containers/GameGoldenLayout';
import GameHeader from './parts/components/GameHeader';
import GameExitDialog from './parts/components/GameExitDialog';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenDrawer: false,
      isOpenExitDialog: false
    };
    this.handleDrawer = this.handleDrawer.bind(this);
    this.handleExitDialog = this.handleExitDialog.bind(this);
  }

  handleDrawer(isOpenDrawer) {
    this.setState({ isOpenDrawer });
  }

  handleExitDialog(isOpenExitDialog) {
    this.setState({ isOpenExitDialog });
  }

  render() {
    return (
      <React.Fragment>
        <GameHeader
          handleDrawer={this.handleDrawer}
          handleExitDialog={this.handleExitDialog}
        />
        <GameGoldenLayout />
        <GameDrawer
          handleDrawer={this.handleDrawer}
          isOpenDrawer={this.state.isOpenDrawer}
        />
        <GameExitDialog
          handleExitDialog={this.handleExitDialog}
          isOpenExitDialog={this.state.isOpenExitDialog}
        />
      </React.Fragment>
    );
  }
}

export default Game;
