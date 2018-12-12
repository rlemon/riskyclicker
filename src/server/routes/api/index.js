import { Router } from 'express';
import knex from '../../db/connection';

const router = Router();

router.get( '/nsfw/:page?', async ( req, res ) => {
	const { page = 0 } = req.params;
	const hashes = await knex.select( 'hash' ).from( 'images' ).where( 'weight', '<', 0 )
		.orderBy( 'weight', 'desc' )
		.limit( 20 )
		.offset( page * 20 );
	res.json( hashes );
} );

export default router;
