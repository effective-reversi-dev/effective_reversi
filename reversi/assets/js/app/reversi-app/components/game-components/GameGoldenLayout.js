import React from 'react';
import GoldenLayout from 'golden-layout';

class GameGoldenLayout extends React.Component {
    componentDidMount() {
        const config = {
            content: [{
                type: 'row',
                content:[{
                    type:'react-component',
                    component: 'test-component',
                    title: 'exampleA',
                    props: { label: 'A' },
                    width: 20,
                },{
                    type: 'column',
                    content:[{
                        type:'react-component',
                        component: 'test-component',
                        title: 'exampleB',
                        props: { label: 'B' },
                    },{
                        type:'react-component',
                        component: 'test-component',
                        title: 'exampleC',
                        props: { label: 'C' },
                        height: 30,
                    }]
                },{
                    type:'react-component',
                    component: 'test-component',
                    title: 'exampleD',
                    props: { label: 'D' },
                    width: 20,
                }]
            }]
        };

        let layout = new GoldenLayout(config, this.layout);
        layout.registerComponent('test-component', TestComponent);
        layout.init();

    }

    render() {
        return (
            <div className='goldenLayout'/>
        );
    }
}

const TestComponent = (props) => {
    return <h1>{props.label}</h1>;
}

export default GameGoldenLayout;
