import React from 'react';
import PropTypes from 'prop-types';
import GoldenLayout from 'golden-layout';

class GameGoldenLayout extends React.Component {
    constructor(props){
        super(props);

        const config = {
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
                        props: { label: 'D' },
                        width: 20,
                    }]
                }]
            }]
        };

        const layout = new GoldenLayout(config);
        for(let i=0; i<this.props.panelNames.length; i++){
            layout.registerComponent(this.props.panelNames[i], TestComponent);
        }
        layout.on('itemDestroyed', (item) => this.props.onRemoveItem(item));
        layout.on('itemCreated', (item) => this.props.onRegisterOpen(item));
        layout.init();

        this.state = {
            layout: layout,
        }
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
    onRemoveItem: PropTypes.func.isRequired,
    onRegisterOpen: PropTypes.func.isRequired,
}

export default GameGoldenLayout;
