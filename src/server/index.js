import http from 'http';
import express, { Router } from 'express';
import path from 'path';
import apiRouter from './routes/api';
// import knex from './db/connection';

const { PORT = 7318, MODE = 'development' } = process.env;
const app = express();
const httpServer = http.createServer( app );
const router = Router();
router.use( '/api', apiRouter );

app.use( express.static( path.join( __dirname, 'assets' ) ) );
app.use( router );

app.use( ( req, res, next ) => {
	res.sendFile( 'index.html', {
		root: path.join( __dirname, 'assets' ),
		headers: {
			'Content-Type': 'text/html'
		}
	}, error => {
		if( error ) {
			next( error );
		}
	} );
} );

if( MODE !== 'production' ) {
	app.use( ( err, req, res ) => {
		console.error( err.stack );
		res.status( err.status || 500 );
		res.json( {
			errors: {
				message: err.message,
				error: err
			}
		} );
	} );
}

app.use( ( err, req, res ) => {
	res.status( err.status || 500 );
	res.json( {
		errors: {
			message: err.message,
			error: {}
		}
	} );
} );

httpServer.listen( PORT, () => {
	console.info( `server started and listening on port ${httpServer.address().port}` );
} );
