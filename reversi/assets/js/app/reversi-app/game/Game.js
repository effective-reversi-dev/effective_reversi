import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { gameActions } from './modules';
import GameDrawer from './parts/containers/GameDrawer';
import GameGoldenLayout from './parts/containers/GameGoldenLayout';
import GameHeader from './parts/components/GameHeader';
import GameExitModal from './parts/components/GameExitModal';

const { displayExitDialog, closeExitDialog } = gameActions;

const mapStateToProps = state => {
  const {
    exitTitle,
    exitDescription,
    shouldDisplayCancel,
    isOpenExitDialog
  } = state.game.game;
  return { exitTitle, exitDescription, shouldDisplayCancel, isOpenExitDialog };
};

const mapDispatchToProps = dispatch => ({
  displayExitDialog: () =>
    dispatch(
      displayExitDialog({
        exitTitle: '退出しますか？',
        exitDescription: 'ゲームから退出しますか?　退出したら負けになります。',
        shouldDisplayCancel: true
      })
    ),
  closeExitDialog: () => dispatch(closeExitDialog())
});

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpenDrawer: false
    };
    this.handleDrawer = this.handleDrawer.bind(this);
    this.handleExitDialog = this.handleExitDialog.bind(this);
  }

  componentWillUnmount() {
    this.props.closeExitDialog();
  }

  handleDrawer(isOpenDrawer) {
    this.setState({ isOpenDrawer });
  }

  handleExitDialog(isOpenExitDialog) {
    if (isOpenExitDialog) {
      this.props.displayExitDialog();
    } else {
      this.props.closeExitDialog();
    }
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
        <GameExitModal
          onCloseDialog={
            this.props.shouldDisplayCancel
              ? () => this.handleExitDialog(false)
              : () => null
          }
          onClickCancel={() => this.handleExitDialog(false)}
          isOpenExitDialog={this.props.isOpenExitDialog}
          shouldDisplayCancel={this.props.shouldDisplayCancel}
          title={this.props.exitTitle}
          description={this.props.exitDescription}
        />
      </React.Fragment>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);

Game.propTypes = {
  exitTitle: PropTypes.string.isRequired,
  exitDescription: PropTypes.string.isRequired,
  shouldDisplayCancel: PropTypes.bool.isRequired,
  isOpenExitDialog: PropTypes.bool.isRequired,
  displayExitDialog: PropTypes.func.isRequired,
  closeExitDialog: PropTypes.func.isRequired
};
