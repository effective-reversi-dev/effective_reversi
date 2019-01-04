import React from 'react';
import {Link} from 'react-router-dom';

class TopPage extends React.Component {

    render() {
        return(
            <ul>
                <li><Link to='/'>TopPage</Link></li>
                <li><Link to='/game'>Game</Link></li>
            </ul>
        );
    }
}

export default TopPage;
