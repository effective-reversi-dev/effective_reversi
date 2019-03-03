import React from 'react';
import Forms from './components/Forms';
import { CookiesProvider } from 'react-cookie';

class UserConfig extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            currentConfigs: {
                displayName:""
            },
        }
        this.onClickButton = this.onClickButton.bind(this);
    }

    onClickButton(){
        if (this.state.currentConfigs){
//            this.props.onSendUserInfoChange(this.state.currentConfigs);
            this.setState({
                currentConfigs: {
                    displayName:""
                },
            })
        };
    }
    
    render() {
        return (
            <React.Fragment>
                <div className="container">
                    <h1 className="text-center logo my-4">
                        Effective Reversi
                    </h1>
                    <div className="row justify-content-center">
                        <div className="col-lg-8 col-md-10 col-sm-12">
                            <div className="card">
                            <div className="card-body">
                                <h3 className="card-title">ユーザ設定</h3>
                                <Forms/>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default UserConfig;
