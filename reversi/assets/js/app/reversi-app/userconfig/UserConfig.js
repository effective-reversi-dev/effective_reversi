import React from 'react';
import Forms from './containers/Forms';

class UserConfig extends React.Component {
    constructor(props){
        super(props);
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
                                <div className="card-footer text-muted text-center">
                                    <a href='/users/change_password'>パスワード変更はこちら</a>
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
