import { hot } from 'react-hot-loader/root';
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Game from './game/Game';
import RoomSelection from './room/selection/RoomSelection';
import RoomCreation from './room/creation/RoomCreation';
import TopPage from './top/TopPage';
import UserConfig from './userconfig/UserConfig';
import '../../../sass/style.scss';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={TopPage} />
        <Route path="/game" component={Game} />
        <Route path="/room_selection" component={RoomSelection} />
        <Route path="/room_creation" component={RoomCreation} />
        <Route path="/config" component={UserConfig} />
      </Switch>
    </Router>
  );
};

export default hot(App);
