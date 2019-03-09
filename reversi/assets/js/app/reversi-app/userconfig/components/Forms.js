import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withCookies } from'react-cookie';
import { REQUEST_STATUS } from '../modules'

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
        this.presentResponseStatus = this.presentRequestStatus.bind(this)
    }

    onClickButton(){
        this.props.onSendUserInfoChange(this.state.currentConfigs);
        this.setState({
            currentConfigs: {
                displayName:"",
                emailAddress:""
            },
        });
    }

    presentRequestStatus(){
        if(this.props.requestStatus.status == REQUEST_STATUS.SUCCESS){ 
            return (
                <div className='form-control is-valid'>
                    変更が完了しました。
                </div>
            )
        }else if(this.props.requestStatus.status == REQUEST_STATUS.FAIL){
            return (
                <div className='alert alert-danger'>
                        {this.props.requestStatus.errMsg}
                </div>
            )
        }else{
            return(<div/>)
        }
    }
    
    render() {
        const changeConfigs = (changedConfig) =>{
            this.setState(Object.assign(this.state.currentConfigs, changedConfig))
        }
        const currentConfigs = this.state.currentConfigs
        const { cookies } = this.props;
        return (
            <React.Fragment>
                {this.presentRequestStatus()}
                <div className="form-group">
                    <TextField
                        value={currentConfigs.displayName}
                        className="item"
                        label="ユーザ表示名"
                        onChange={(e) => { changeConfigs({displayName:e.target.value})}}
                        margin="normal"
                    />
                    <small className="form-text text-muted">現在の設定: [{cookies.get('display_name')}]</small>
                </div>
                <div className="form-group">
                    <TextField
                        value={currentConfigs.emailAddress}
                        className="item"
                        label="E-Mailアドレス"
                        onChange={(e) => { changeConfigs({emailAddress:e.target.value})}}
                        margin="normal"
                    />
                    <small className="form-text text-muted">現在の設定: [{cookies.get('email')}]</small>
                </div>
                <div>
                    <Button 
                        variant="outlined"
                        color="primary"
                        className="button"
                        onClick={this.onClickButton}>
                        変更内容を送信
                    </Button>
                </div>
            </React.Fragment>
        );
    }
}

Forms.propTypes = {
     requestStatus:PropTypes.object.isRequired,
     onSendUserInfoChange: PropTypes.func.isRequired,
}
export default withCookies(Forms);
