import React from 'react';
import PropTypes from 'prop-types';
import GoldenLayout from 'golden-layout';

import GameChat from '../../containers/game-containers/GameChat';
import { Provider } from 'react-redux';
import store from '../../../../pages/homePage';

class GameGoldenLayout extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            layout: null,
        }
        this.props.initChatSocket();
    }

    componentDidMount() {
        const config = {
            settings:{
                showPopoutIcon: false,
                showMaximiseIcon: false,
            },
            content: [{
                type: 'row',
                isClosable: false,
                content:[{
                    type: 'row',
                    content:[{
                        type:'react-component',
                        component: this.props.panelNames[0],
                        title: this.props.panelNames[0],
                        props: { label: 'A' },
                        width: 20,
                    },
                    {
                        type: 'column',
                        content:[{
                            type:'react-component',
                            component: this.props.panelNames[1],
                            title: this.props.panelNames[1],
                            props: { label: 'B' },
                        },
                        {
                            type:'react-component',
                            component: this.props.panelNames[2],
                            title: this.props.panelNames[2],
                            props: { label: 'C' },
                            height: 30,
                        }]
                    },
                    {
                        type:'react-component',
                        component: this.props.panelNames[3],
                        title: this.props.panelNames[3],
                        width: 20,
                    }]
                }]
            }]
        };
        setTimeout(() => {
            // truncate the bottom of the screen
            let h = window.innerHeight,
                ht = $(".layout-header-wrapper").height();
            $(".goldenLayout").height(h-ht);

            const layout = new GoldenLayout(config, $(".goldenLayout"));
            layout.registerComponent(this.props.panelNames[0], TestComponent);
            layout.registerComponent(this.props.panelNames[1], TestComponent);
            layout.registerComponent(this.props.panelNames[2], TestComponent);
            layout.registerComponent(this.props.panelNames[3], withProvider(store)(GameChat));
            
            layout.on('itemDestroyed', (item) => this.props.onRemoveItem(item));
            layout.on('itemCreated', (item) => this.props.onRegisterOpen(item));
            layout.init();
            this.setState({layout: layout});
        }, 0);
    }

    componentDidUpdate(prevProps) {
        const { addedPanel } = this.props;
        if(addedPanel){
            const config = {
                type:'react-component',
                component: addedPanel,
                title: addedPanel,
                props: { label: 'A' },
                width: 20,
            }
            const { layout } = this.state;
            setTimeout(() => {
                layout.root.contentItems[0].addChild(config);
            }, 0); 
            // not to run componentWillUpdate: https://github.com/golden-layout/golden-layout/pull/348 
        }
    }

    componentWillUnmount() {
        this.props.closeChatSocket();
        const { layout } = this.state;
        setTimeout(() => {
            layout.destroy();
        }, 0);
    }

    render() {
        return (
            <div className="goldenLayout"/>
        );
    }
}

const TestComponent = (props) => {
    return <h1>{props.label}</h1>;
}

function withProvider(store) {
    return (RegisteredComponent) => {
        return class extends React.Component {
            render() {
                return (
                    <Provider store={store}>
                        <RegisteredComponent />
                    </Provider>
                )
            }
        }
    }
}

GameGoldenLayout.propTypes = {
    panelNames: PropTypes.arrayOf(PropTypes.string).isRequired,
    addedPanel: PropTypes.string.isRequired,
    initChatSocket: PropTypes.func.isRequired,
    closeChatSocket: PropTypes.func.isRequired,
    onRemoveItem: PropTypes.func.isRequired,
    onRegisterOpen: PropTypes.func.isRequired,
}

export default GameGoldenLayout;
