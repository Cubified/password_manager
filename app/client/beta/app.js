import preact from 'preact';

import passman from './passman.js';

preact.render(<passman />, document.body);

/*preact.render((
	<div>
		<span>Hello world</span>
		<button onClick={(e)=>{alert('a')}}>click</button>
	</div>
), document.body);*/
