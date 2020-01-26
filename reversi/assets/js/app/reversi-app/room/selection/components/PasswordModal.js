import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { withRouter } from 'react-router';

const PasswordModal = props => {
  const [password, setPassword] = React.useState('');
  return (
    <Dialog
      open={props.isOpenModal}
      onClose={props.closeModal}
      aria-labelledby="dialog-enter-title"
      aria-describedby="dialog-enter-description"
    >
      <DialogTitle id="dialog-enter-title">パスワード確認</DialogTitle>
      <DialogContent>
        <DialogContentText id="dialog-enter-description">
          入室用のパスワードを入力してください。
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          placeholder="パスワード"
          id="password"
          label="パスワード"
          value={password}
          onChange={e => {
            setPassword(e.target.value);
          }}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.closeModal}>キャンセル</Button>
        <Button
          onClick={() => {
            props.submitPassword(password);
            props.closeModal();
          }}
          color="primary"
        >
          入室する
        </Button>
      </DialogActions>
    </Dialog>
  );
};

PasswordModal.propTypes = {
  // react-router
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  // ownProps
  isOpenModal: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  submitPassword: PropTypes.func.isRequired
};
export default withRouter(PasswordModal);
