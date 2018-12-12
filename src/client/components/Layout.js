import React from 'react';
import PropTypes from 'prop-types';

export default function Layout( props ) {
	const { children } = props;
	return (
		<div className='app-wrapper'>
			<div className='content-wrapper'>
				{ children }
			</div>
		</div>
	);
}

Layout.propTypes = {
	children: PropTypes.node
};
