import React from 'react';
import PropTypes from 'prop-types';
import GoldenLayout from 'golden-layout';

import GameChat from '../../containers/game-containers/GameChat';
import glComponentWrapper from '../../components/game-components/glComponentWrapper';

class GameGoldenLayout extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            layout: null,
        }
        this.props.initChatSocket();
    }

    resize() {
        let h = window.innerHeight, 
            w = window.innerWidth,
            ht = $(".layout-header-wrapper").height();
        this.state.layout.updateSize(w, h-ht);
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

            // make size of gl reactive
            $(window).on('load resize', () => this.resize());

            const layout = new GoldenLayout(config, $(".goldenLayout"));
            layout.registerComponent(
                this.props.panelNames[0], 
                glComponentWrapper(TestComponent, this.props, 0)
            );
            layout.registerComponent(
                this.props.panelNames[1], 
                glComponentWrapper(TestComponent, this.props, 1)
            );
            layout.registerComponent(
                this.props.panelNames[2], 
                glComponentWrapper(TestComponent, this.props, 2)
            );
            layout.registerComponent(
                this.props.panelNames[3], 
                glComponentWrapper(GameChat, this.props, 3)
            );
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

GameGoldenLayout.propTypes = {
    panelNames: PropTypes.arrayOf(PropTypes.string).isRequired,
    addedPanel: PropTypes.string.isRequired,
    initChatSocket: PropTypes.func.isRequired,
    closeChatSocket: PropTypes.func.isRequired,
    onRemoveItem: PropTypes.func.isRequired,
    onRegisterOpen: PropTypes.func.isRequired
}

export default GameGoldenLayout;
