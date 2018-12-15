import React from 'react';
import GoldenLayout from 'golden-layout';

class MyLayout extends React.Component {
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

//TODO: Test Component should be located in another file
class TestComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (<h1>{this.props.label}</h1>)
    }
}

export default MyLayout;
