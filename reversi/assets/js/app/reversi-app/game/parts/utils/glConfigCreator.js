// a function to create config of a library called Golden-Layout for GameGoldenLayout.
export default panelNames => ({
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
                component: panelNames[0],
                title: panelNames[0],
                props: { label: 'A' },
                width: 20,
            },
            {
                type: 'column',
                content:[{
                    type:'react-component',
                    component: panelNames[1],
                    title: panelNames[1],
                    props: { label: 'B' },
                },
                {
                    type:'react-component',
                    component: panelNames[2],
                    title: panelNames[2],
                    props: { label: 'C' },
                    height: 30,
                }]
            },
            {
                type:'react-component',
                component: panelNames[3],
                title: panelNames[3],
                width: 20,
            }]
        }]
    }]
});
