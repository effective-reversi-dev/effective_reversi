import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class GameChat extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            message: '',
        }
        this.onClickButton = this.onClickButton.bind(this);
    }

    componentWillUnmount() {
        this.props.closeChatSocket();
    }

    onClickButton(){
        if (this.state.message){
            this.props.onSendChatInfo(this.state.message);
            this.setState({
                message: '',
            })
        };
    }
    
    render() {
        const items = this.props.chatInfo.map((info, index) => {
            return ( 
                <div className="balloon" key={index}>
                    <div className="balloon-user">
                        <p>{info.userName}</p>
                    </div>
                    <div className="balloon-chat">
                        <div className="balloon-left">
                            <p>{info.message}</p>
                        </div>
                        <div className="balloon-time">
                            <p>{info.time}</p>
                        </div>
                    </div>
                </div>
            )
        });
        return (
            <React.Fragment>
                <div className="tracks">
                    {items}
                </div>
                <div className="inline-bottom">
                    <Button 
                        variant="outlined"
                        color="primary"
                        className="button"
                        onClick={this.onClickButton}>
                        送信
                    </Button>
                    <TextField
                        value={this.state.message}
                        placeholder="Input message..."
                        fullWidth={true}
                        className="item"
                        label="Message"
                        onChange={(e) => {this.setState({message: e.target.value})}}
                        margin="normal"
                    />
                </div>
            </React.Fragment>
        );
    }
}

GameChat.propTypes = {
    chatInfo: PropTypes.arrayOf(PropTypes.object).isRequired,
    closeChatSocket: PropTypes.func.isRequired,
    onSendChatInfo: PropTypes.func.isRequired,
}
export default GameChat;
