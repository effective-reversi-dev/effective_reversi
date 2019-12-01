import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class GameChat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: ''
    };
    this.onClickButton = this.onClickButton.bind(this);
  }

  onClickButton() {
    if (this.state.message) {
      this.props.onSendChatInfo(this.state.message);
      this.setState({
        message: ''
      });
    }
  }

  render() {
    const items = this.props.chatInfo.map(info => {
      const balloon = (
        <div>
          <div className="balloon-user">
            <p>{info.displayName}</p>
          </div>
          <div className="balloon-chat">
            <div className="balloon-content">
              <p>{info.data.message}</p>
            </div>
            <div className="balloon-time">
              <p>{info.data.time}</p>
            </div>
          </div>
        </div>
      );
      return info.displayName === this.props.displayName ? (
        <div className="balloon-mine" key={info.id}>
          {balloon}
        </div>
      ) : (
        <div className="balloon-others" key={info.id}>
          {balloon}
        </div>
      );
    });
    return (
      <React.Fragment>
        <div className="tracks">{items}</div>
        <div className="inline-bottom">
          <Button
            variant="outlined"
            color="primary"
            className="button"
            onClick={this.onClickButton}
          >
            送信
          </Button>
          <TextField
            value={this.state.message}
            placeholder="Input message..."
            fullWidth
            className="item"
            label="Message"
            onChange={e => {
              this.setState({ message: e.target.value });
            }}
            onKeyPress={e => {
              if (e.key === 'Enter') {
                this.onClickButton();
              }
            }}
            margin="normal"
          />
        </div>
      </React.Fragment>
    );
  }
}

GameChat.propTypes = {
  chatInfo: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSendChatInfo: PropTypes.func.isRequired,
  displayName: PropTypes.string.isRequired
};

export default GameChat;
