import React from 'react';
import {Link} from 'react-router-dom';


const Links = (props) => {
    return(
        <ul>
            <li><Link to='/'>TopPage</Link></li>
            <li><Link to='/game'>Game</Link></li>
            <li><Link to='/config'>Setting</Link></li>
            {/* 下記リンクではログアウトするためにServer側にHttpリクエストを送出したい。故にアンカータグ */}
            <li><a href='/users/logout'>Logout</a></li>
        </ul>
    );
}

export default Links;
