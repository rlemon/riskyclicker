/* eslint-disable */

import filmData from './filmData';

const devTools = /./;
devTools.toString = function() {
	this.opened = true;
};

const linesPerFrame = 14;
const timeoutBase = 100;
let currentFrame = 0;
function renderFrame() {
	console.log( '%c', devTools ); // test for dev tools. 
	if( !devTools.opened ) {
		return setTimeout( renderFrame, 1000 );
	} else {
		devTools.opened = false;
	}
	console.clear();
	let str = '';
	let timeout = timeoutBase;
	for( let i = 0; i < linesPerFrame; i++ ) {
		const index = ( linesPerFrame * currentFrame ) + i;
		if( !i ) { // first line is the delay modifier
			timeout *= parseInt( filmData[index], 10 );
			continue;
		}
		str += filmData[index] + '\n';
	}
	console.log( '%s', str );
	currentFrame += 1;
	setTimeout( renderFrame, timeout );
}

renderFrame();
