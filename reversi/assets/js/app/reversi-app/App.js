import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Game from './game/Game';
import TopPage from './top/TopPage';
import UserConfig from './userconfig/UserConfig';
import '../../../sass/style.scss';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" exact component={TopPage} />
          <Route path="/game" component={Game} />
          <Route path="/config" component={UserConfig} />
        </Switch>
      </Router>
    );
  }
}

export default App;
