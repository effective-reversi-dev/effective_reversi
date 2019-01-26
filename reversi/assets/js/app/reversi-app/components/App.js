import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Game from './Game'
import TopPage from './TopPage'
import '../../../../sass/style.scss'

class App extends React.Component {
    render() {
        return(
            <Router>
                <Switch>
                    <Route path='/' exact component={TopPage}/>
                    <Route path='/game' component={Game}/>
                </Switch>
            </Router>
        );
    }
}

export default App;
