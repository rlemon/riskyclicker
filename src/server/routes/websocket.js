import WebSocket from 'ws';
import knex from '../db/connection';

export default async function websocketApi( server ) {
	const wss = new WebSocket.Server( { server } );
	wss.on( 'connection', async ( socket, req ) => {
		socket.on( 'message', async message => {
			const { hash, vote } = JSON.parse( message );

			const weight = vote > 0 ? 1 : -1;
			if( !/^\w+$/.test( hash ) ) {
				return socket.send( JSON.stringify( { message: 'fuck off' } ) );
			}
			const insert = knex( 'images' ).insert( { hash, weight } );
			const query = `${insert.toString()} 
				ON CONFLICT (hash) DO 
					UPDATE SET weight = images.weight + ${weight} WHERE images.hash = '${hash}'
			`;
			await knex.raw( query ); // pls don't hack me.
			if( Math.random() > 0.98 ) {
				const ret = await knex.select( 'hash' ).from( 'images' ).orderByRaw( 'random()' ).first();
				return socket.send( JSON.stringify( ret ) );
			}
			socket.send( JSON.stringify( { hash: null } ) );
		} );
	} );
}
