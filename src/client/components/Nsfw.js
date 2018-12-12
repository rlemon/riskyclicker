import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

@observer
export default class Nsfw extends React.Component {
	@observable hashlist = [];

	page = 0;

	componentDidMount() {
		this.loadImages();
	}

	@action updateHashlist( hashlist ) {
		this.hashlist.replace( this.hashlist.concat( hashlist ) );
	}

	async loadImages() {
		const results = await fetch( `https://riskyclicker.com/api/nsfw/${this.page}` );
		const json = await results.json();
		this.updateHashlist( json );
	}

	nextPage() {
		this.page += 1;
		this.loadImages();
	}

	render() {
		return (
			<div>
				<ul>
					{
						this.hashlist.map( ( { hash } ) => (
							<li key={hash}><img src={`https://i.imgur.com/${hash}.png`} /></li>
						) )
					}
				</ul>
				<button
					onClick={ () => this.nextPage() }
				>
				more
				</button>
			</div>
		);
	}
}
