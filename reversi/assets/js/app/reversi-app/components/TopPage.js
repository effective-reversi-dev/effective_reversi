import React from 'react';
import {Link} from 'react-router-dom';

class TopPage extends React.Component {

    render() {
        return(
            <ul>
                <li><Link to='/'>TopPage</Link></li>
                <li><Link to='/game'>Game</Link></li>
                {/* 下記リンクではログアウトするためにServer側にHttpリクエストを送出したい。故にアンカータグ */}
                <li><a href='/logout'>Logout</a></li>
            </ul>
        );
    }
}

export default TopPage;
