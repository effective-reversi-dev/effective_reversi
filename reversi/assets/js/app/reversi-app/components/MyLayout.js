import React from 'react';
import  GoldenLayout from 'golden-layout';

class MyLayout extends React.Component {
    componentDidMount() {
        const config = {
            content: [{
                type: 'row',
                content:[{
                    type:'react-component',
                    component: 'test-component',
                    props: { label: 'A' },
                    width: 20,
                },{
                    type: 'column',
                    content:[{
                        type:'react-component',
                        component: 'test-component',
                        props: { label: 'B' },
                    },{
                        type:'react-component',
                        component: 'test-component',
                        props: { label: 'C' },
                        height: 30,
                    }]
                },{
                    type:'react-component',
                    component: 'test-component',
                    props: { label: 'D' },
                    width: 20,
                }]
            }]
        };

        class TestComponent extends React.Component {
            constructor(props) {
                super(props);
            }
            render() {
                return (<h1>{this.props.label}</h1>)
            }
        }

        var layout = new GoldenLayout(config, this.layout);
        layout.registerComponent('test-component', TestComponent);
        layout.init();

    }

    render() {
        return (
            <div className='goldenLayout'/>
        );
    }
}

export default MyLayout;
