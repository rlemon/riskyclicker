import React from 'react';
import { observable, action, runInAction } from 'mobx';
import { observer, inject } from 'mobx-react';
import censoredImage from '../censored.png';

function generateImgurId( length ) {
	const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
	return length ? chars.charAt( Math.floor( Math.random() * chars.length ) ) + generateImgurId( length - 1 ) : '';
}

function invalidImage( img ) {
	return ( img.width === 161 && img.height === 81 ) ||
			( img.height < 80 || img.width < 80 );
}

function getNewImage() {
	return new Promise( ( resolve, reject ) => {
		const id = generateImgurId( Math.floor( Math.random() * 2 + 4 ) );
		const img = new Image();
		img.crossOrigin = 'Anonymous';
		img.onload = () => {
			if( invalidImage( img ) ) {
				return reject();
			}
			resolve( img );
		};
		img.onerror = reject;
		img.src = `https://i.imgur.com/${id}l.png`;
	} );
}

async function getNextImage() {
	try {
		const img = await getNewImage();
		return img;
	} catch ( error ) {
		return getNextImage();
	}
}

@inject( 'websocket' )
@observer
export default class Game extends React.Component {
	@observable background = null;

	@observable changing = false;

	@observable history = [];

	@observable count = 0;

	@observable highscore = 0;

	componentWillMount() {
		this.props.websocket.connect();
	}

	componentDidMount() {
		const savedScore = window.localStorage.getItem( 'highscore' );
		if( savedScore !== null && !isNaN( savedScore ) ) { // eslint-disable-line no-restricted-globals
			runInAction( () => {
				this.highscore = Number( savedScore );
			} );
		}
		this.nextImage();
	}

	@action setChanging( value ) {
		this.changing = value;
	}

	@action setCount( value ) {
		this.count = value;
		if( this.count > this.highscore ) {
			this.highscore = this.count;
			window.localStorage.setItem( 'highscore', this.highscore );
		}
	}

	@action changeBackground( url ) {
		if( this.props.websocket.replay ) {
			url = `https://i.imgur.com/${this.props.websocket.replay}.png`;
		}
		this.background = url;
		this.props.websocket.replay = null;
		this.history.push( url );
	}

	handleSFWClick() {
		this.setCount( this.count + 1 );
		try {
			this.props.websocket.sendMessage( {
				hash: this.background.match( /\w+(?=\.\w+$)/ )[0],
				vote: 1
			} );
		} catch ( error ) {
		}
		this.nextImage();
	}

	handleNSFWClick() {
		this.setChanging( true );
		const hash = this.background.match( /\w+(?=\.\w+$)/ )[0];
		this.changeBackground( censoredImage );
		this.setCount( 0 );
		try {
			this.props.websocket.sendMessage( {
				hash,
				vote: 0
			} );
		} catch( error ) {
		}
		runInAction( () => {
			this.history = [];
		} );
		this.nextImage();
	}

	async nextImage() {
		this.setChanging( true );
		const { src } = await getNextImage();
		this.changeBackground( src );
		setTimeout( () => {
			this.setChanging( false );
			this.bottomElement.scrollIntoView( { behavior: 'smooth' } );
		}, 130 ); // offset the css transition.
	}

	render() {
		return (
			<div className='game-container'>
				<div className='titlebar'>
					<span className='game-title'>Risky Clicker</span>
				</div>
				<div className='score-container'>
					<h3>Score: {this.count} <span className='highscore'>{this.highscore}</span></h3>
					<h4>History</h4>
					<div className='history-container'>
						<ul className='history'>
							{
								this.history.map( url => (
									<li
										key={`historylink-${url}`}
									>
										<a
											href={url}
											rel='noopener noreferrer'
											target='_blank'
										>
											{url.split( '/' ).pop()}
										</a>
									</li>
								) )
							}
						</ul>
						<div ref={el => this.bottomElement = el}></div>
					</div>
				</div>
				<div
					className={`image-container ${this.changing ? 'changing' : ''}`}
				>
					<div
						className='image'
						style={{ backgroundImage: `url(${this.background})` }}
					/>
					<div className='loading' />
				</div>
				<div className='button-container'>
					<button
						type='button'
						disabled={this.changing}
						className='button lined thin'
						onClick={() => this.handleNSFWClick()}
					>
						NSFW
					</button>
					<button
						type='button'
						disabled={this.changing}
						className='button lined thin'
						onClick={() => this.handleSFWClick()}
					>
						SFW
					</button>
				</div>
			</div>
		);
	}
}
