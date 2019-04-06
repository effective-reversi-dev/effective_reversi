import React from 'react';
import Form from './containers/Form';
import {Link} from 'react-router-dom';

 const UserConfig = (props) => {
    return (
        <div className='container'>
            <h1 className='text-center logo my-4'>
                Effective Reversi
            </h1>
            <div className='row justify-content-center'>
                <div className='col-lg-8 col-md-10 col-sm-12'>
                    <div className='card'>
                        <div className='card-body'>
                            <h3 className='card-title'>ユーザ設定</h3>
                            <Form/>
                        </div>
                        <div className='card-footer text-muted text-center'>
                            <a href='/users/change_password'>パスワード変更はこちら</a>
                        </div>
                    </div>
                    <div className='text-center py-2'>
                        <small>
                                <Link to='/' className='text-muted'>Topへ戻る</Link>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserConfig;
