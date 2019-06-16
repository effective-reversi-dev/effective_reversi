import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withRouter } from 'react-router';
import { gameActions } from './modules';
import { roomActions } from '../room/modules';
import GameDrawer from './parts/containers/GameDrawer';
import GameGoldenLayout from './parts/containers/GameGoldenLayout';
import GameHeader from './parts/components/GameHeader';
import GameExitModal from './parts/components/GameExitModal';

const { displayExitDialog, closeExitDialog } = gameActions;
const { exitRoom } = roomActions;

const mapStateToProps = state => {
  const {
    exitTitle,
    exitDescription,
    shouldDisplayCancel,
    isOpenExitDialog
  } = state.game.game;
  const { roomId } = state.roomSelection.roomSelection.currentRoomInfo;
  return {
    exitTitle,
    exitDescription,
    shouldDisplayCancel,
    isOpenExitDialog,
    hasInValidState: roomId === undefined || roomId === null
  };
};

const mapDispatchToProps = dispatch => ({
  displayExitDialog: () =>
    dispatch(
      displayExitDialog({
        exitTitle: '退出しますか？',
        exitDescription:
          'ゲーム画面から移動しますか?　移動した場合負けになります。',
        shouldDisplayCancel: true
      })
    ),
  closeExitDialog: () => dispatch(closeExitDialog()),
  exitRoom: () => dispatch(exitRoom())
});

class Game extends React.Component {
  constructor(props) {
    super(props);
    // ゲーム画面で更新ボタンが押されたり、
    // アドレスバーから直接 game へ遷移しようとした場合のハンドル。
    if (props.hasInValidState) {
      props.history.push('/room_selection');
    }
    this.onBeforeunloadHandler = e => {
      e.returnValue = '画面を更新すると、部屋選択画面へ戻ります。';
    };

    this.state = {
      isOpenDrawer: false
    };
    this.handleDrawer = this.handleDrawer.bind(this);
    this.handleExitDialog = this.handleExitDialog.bind(this);
    window.addEventListener('beforeunload', this.onBeforeunloadHandler, false);
  }

  componentWillUnmount() {
    this.props.closeExitDialog();
    this.props.exitRoom();
    window.removeEventListener(
      'beforeunload',
      this.onBeforeunloadHandler,
      false
    );
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

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Game)
);

Game.propTypes = {
  hasInValidState: PropTypes.bool.isRequired,
  exitTitle: PropTypes.string.isRequired,
  exitDescription: PropTypes.string.isRequired,
  shouldDisplayCancel: PropTypes.bool.isRequired,
  isOpenExitDialog: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  displayExitDialog: PropTypes.func.isRequired,
  closeExitDialog: PropTypes.func.isRequired,
  exitRoom: PropTypes.func.isRequired
};
