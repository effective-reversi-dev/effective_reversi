import React from 'react';
import PropTypes from 'prop-types';
import GoldenLayout from 'golden-layout';

import GameChat from '../../panels/gamechat/containers/GameChat';
import glComponentWrapper from '../utils/glComponentWrapper';
import createGlConfig from '../utils/glConfigCreator';

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
        $(".goldenLayout").height(h-ht);
        $(".goldenLayout").width(w);
    }

    componentDidMount() {
        const config = createGlConfig(this.props.panelNames);
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
    onRemoveItem: PropTypes.func.isRequired,
    onRegisterOpen: PropTypes.func.isRequired
}

export default GameGoldenLayout;
