import React from 'react';
import Forms from './components/Forms';

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
        const changeConfigs = (changedConfig) =>{
            this.setState(Object.assign(this.state.currentConfigs, changedConfig))
        }
        const currentConfigs = this.state.currentConfigs
        return (
            <React.Fragment>
                <div class="container">
                    <h1 class="text-center logo my-4">
                        Effective Reversi
                    </h1>
                    <div class="row justify-content-center">
                        <div class="col-lg-8 col-md-10 col-sm-12">
                            <div class="card">
                            <div class="card-body">
                                <h3 class="card-title">ユーザ設定</h3>
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