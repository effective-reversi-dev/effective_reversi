import React from 'react';
import ReactDOM from 'react-dom';
import MyLayout from '../app/reversi-app';


const title = 'It really does work! (this section is rendered by React, ' +
              "change the app's name below to test hot reloading)";

//ReactDOM.render(<ColorChanger title={title} />, document.getElementById('react-app'));
ReactDOM.render(<MyLayout />, document.getElementById('reversi-app'));
