import React from 'react';

import GameDrawer from './../containers/game-containers/GameDrawer';
import GameGoldenLayout from './../containers/game-containers/GameGoldenLayout';
import GameHeader from './../containers/game-containers/GameHeader';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenDrawer: false,
        }
        this.handleDrawer = this.handleDrawer.bind(this);
    }

    handleDrawer(isOpenDrawer) {
        this.setState({isOpenDrawer: isOpenDrawer})
    }

    render() {
        return(
            <React.Fragment>
                <GameHeader handleDrawer={this.handleDrawer} />
                <GameGoldenLayout />
                <GameDrawer handleDrawer={this.handleDrawer} isOpenDrawer={this.state.isOpenDrawer} />
            </React.Fragment>
        );
    }
}

export default App;
