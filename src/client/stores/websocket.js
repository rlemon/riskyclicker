const webSocketAddress = 'wss://riskyclicker.com';

function connectWebSocketAsync( address, token ) {
	return new Promise( ( resolve, reject ) => {
		const connection = new WebSocket( `${address}?token=${token}` );
		connection.addEventListener( 'error', reject );
		connection.addEventListener( 'open', () => resolve( connection ) );
	} );
}

class WebsocketStore {
	connection = undefined;

	replay = null;

	async connect( ) {
		try {
			this.connection = await connectWebSocketAsync( webSocketAddress, null );

			this.connection.addEventListener( 'message', message => this.onMessage( message ) );
			this.connection.addEventListener( 'close', () => this.reconnect() );
			this.connection.addEventListener( 'error', () => this.reconnect() );
		} catch ( error ) {
			console.log( 'websocket connection error', error );
			this.reconnect();
		}
	}

	disconnect() {
		this.connection.close();
	}

	reconnect() {
		this.connection.close();
		setTimeout( () => this.connect(), 10000 );
	}

	onMessage( message ) {
		const { hash } = JSON.parse( message.data );
		this.replay = hash;
	}

	sendMessage( messageObject ) {
		if( !this.connection || this.connection.readyState !== WebSocket.OPEN ) {
			throw new Error( 'cannot send message when the websocket is closed' );
		}
		this.connection.send( JSON.stringify( messageObject ) );
	}
}

export default new WebsocketStore();
