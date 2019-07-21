import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withRouter } from 'react-router';

const GameExitModal = props => {
  return (
    <Dialog
      open={props.isOpenExitDialog}
      onClose={props.onCloseDialog}
      aria-labelledby="alert-leave-title"
      aria-describedby="alert-leave-description"
    >
      <DialogTitle id="alert-leave-title">{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-leave-description">
          {props.description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {props.shouldDisplayCancel ? (
          <Button onClick={props.onClickCancel} color="primary" autoFocus>
            キャンセル
          </Button>
        ) : null}
        <Button onClick={() => props.history.push('/')}>退出する</Button>
      </DialogActions>
    </Dialog>
  );
};

export default withRouter(GameExitModal);

GameExitModal.propTypes = {
  // react-router
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  // ownProps
  isOpenExitDialog: PropTypes.bool.isRequired,
  onCloseDialog: PropTypes.func.isRequired,
  onClickCancel: PropTypes.func.isRequired,
  shouldDisplayCancel: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};
