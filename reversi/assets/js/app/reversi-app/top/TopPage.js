import React from 'react';
import {Link} from 'react-router-dom';
import Links from './components/Links';

class TopPage extends React.Component {

    render() {
        return(
            <React.Fragment>
                <div class="container">
                    <h1 class="text-center logo my-4">
                        Effective Reversi
                    </h1>
                    <div class="row justify-content-center">
                        <div class="col-lg-8 col-md-10 col-sm-12">
                            <div class="card">
                            <div class="card-body">
                                <h3 class="card-title">メインメニュー</h3>
                                <Links/>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default TopPage;
