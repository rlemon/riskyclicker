exports.up = knex => (
	knex.schema.createTable( 'images', table => {
		table.increments();
		table.string( 'hash' ).notNullable().unique();
		table.integer( 'weight' ).notNullable().defaultTo( 0 );
		table.boolean( 'locked' ).notNullable().defaultTo( false );
	} )
);

exports.down = knex => (
	knex.schema.dropTable( 'images' )
);
