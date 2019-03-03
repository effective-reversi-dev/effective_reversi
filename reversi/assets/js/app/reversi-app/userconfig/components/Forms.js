import React from 'react';
import PropTypes from 'prop-types';;
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class Forms extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currentConfigs: {
                displayName:"",
                emailAddress:""
            },
        }
        this.onClickButton = this.onClickButton.bind(this);
    }

    onClickButton(){
        if (this.state.currentConfigs){
//            this.props.onSendUserInfoChange(this.state.currentConfigs);
            this.setState({
                currentConfigs: {
                    displayName:"",
                    emailAddress:""
                },
            })
        };
    }
    
    render() {
        const changeConfigs = (changedConfig) =>{
            this.setState(Object.assign(this.state.currentConfigs, changedConfig))
        }
        const currentConfigs = this.state.currentConfigs
        return (
            <React.Fragment>
                <div className="form-group">
                    <TextField
                        value={currentConfigs.displayName}
                        className="item"
                        label="ユーザ表示名"
                        onChange={(e) => { changeConfigs({displayName:e.target.value})}}
                        margin="normal"
                    />
                    <small class="form-text text-muted">現在の設定値:</small>
                </div>
                <div className="form-group">
                    <TextField
                        value={currentConfigs.emailAddress}
                        className="item"
                        label="E-Mailアドレス"
                        onChange={(e) => { changeConfigs({emailAddress:e.target.value})}}
                        margin="normal"
                    />
                    <small class="form-text text-muted">現在の設定値:</small>
                </div>
                <div>
                    <Button 
                        variant="outlined"
                        color="primary"
                        className="button"
                        onClick={this.onClickButton}>
                        送信
                    </Button>
                </div>
            </React.Fragment>
        );
    }
}

// UserConfigs.propTypes = {
//     userInfo: PropTypes.object.isRequired,
//     requestStatus:PropTypes.object.isRequired,
//     onSendUserInfoChange: PropTypes.func.isRequired,
// }
export default Forms;
