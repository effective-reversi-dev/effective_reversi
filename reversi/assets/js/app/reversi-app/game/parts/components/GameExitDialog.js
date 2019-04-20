import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withRouter } from 'react-router';

const GameExitDialog = props => {
  return (
    <Dialog
      open={props.isOpenExitDialog}
      onClose={() => props.handleExitDialog(false)}
      aria-labelledby="alert-leave-title"
      aria-describedby="alert-leave-description"
    >
      <DialogTitle id="alert-leave-title">退出しますか?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-leave-description">
          ゲームから退出しますか?退出したら負けになります。
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => props.handleExitDialog(false)}
          color="primary"
          autoFocus
        >
          キャンセル
        </Button>
        <Button onClick={() => props.history.push('/')}>退出する</Button>
      </DialogActions>
    </Dialog>
  );
};

export default withRouter(GameExitDialog);

GameExitDialog.propTypes = {
  isOpenExitDialog: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  handleExitDialog: PropTypes.func.isRequired
};
