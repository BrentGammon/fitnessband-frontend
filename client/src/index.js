import React from 'react';
import ReactDOM from 'react-dom';
import Routing from './Routing';
import registerServiceWorker from './registerServiceWorker';
import './index.scss';






ReactDOM.render(<Routing />, document.getElementById('root'));
registerServiceWorker();
