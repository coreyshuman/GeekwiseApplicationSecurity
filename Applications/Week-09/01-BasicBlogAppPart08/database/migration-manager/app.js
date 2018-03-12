const pgp = require( 'pg-promise' )();
const migrationFolder = '/home/node/app/migrations/';
const fs = require( 'fs' );
const path = require( 'path' );
const dataSeed = require( 'data-seed' );
const bcrypt = require( 'bcryptjs' );

const cn = {
  host: process.env.POSTGRES_HOST || 'localhost', // 'localhost' is the default;
  port: process.env.POSTGRES_PORT || 5432, // 5432 is the default;
  database: process.env.POSTGRES_DB || 'postgres',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || ''
};

console.log( cn );
const db = pgp( cn );

dataSeed.register( 'dateFriendly', ( a, b ) => {
  return dataSeed.seed.date.format( null, a, b );
} );

class MigrationTools {
  static get util() { return dataSeed.util; }
  static get seed() { return dataSeed.seed; }
  static get bcrypt() { return bcrypt; }
  static get db() { return db; }
}

class Migration {
  async run() {
    // get migrations from table
    const query = `SELECT * FROM migrations ORDER BY id ASC`;
    db.any( query )
      .then( dbMigrations => {
        //console.log( dbMigrations );
        // get migration files from /migrations folder
        fs.readdir( migrationFolder, async ( err, files ) => {
          let updateCount = 0;
          let failed = false;
          if ( err ) {
            failed = true;
            this.logError( err );
          } else {
            files = files.sort();
            //console.log( files );

            for ( let fi = 0; fi < files.length; fi++ ) {
              const file = files[ fi ];
              let found = false;
              for ( let mi = 0; mi < dbMigrations.length; mi++ ) {
                if ( file === dbMigrations[ mi ].migration_name ) {
                  found = true;
                  break;
                }
              }
              if ( !found ) {
                updateCount++;
                try {
                  if ( path.extname( file ) === ".sql" ) {
                    const ress = await this.executeScript( file );
                    console.log( `Executed ${ress} script(s)` );
                  } else if ( path.extname( file ) === ".js" ) {
                    const resf = await this.executeFile( file );
                    console.log( `Executed ${resf} script(s)` );
                  } else {
                    throw new Error( 'Invalid file type.' );
                  }
                  await this.completeMigration( file );
                } catch ( e ) {
                  this.logError( `xxx Failed to migrate file ${file}` );
                  this.logError( e );
                  failed = true;
                  break;
                }
              }
            }

            if ( failed ) {
              this.logError( '=========== Migrations FAILED =============' );
            } else if ( updateCount === 0 ) {
              console.log( '=========== No New Migrations ================' );
            } else {
              console.log( '=========== Migrations Finished =============' );
            }
          }
        } );

      } )
      .catch( e => {
        this.logError( `Error getting migrations.` );
        this.logError( e );
      } );
  }

  async executeFile( file ) {
    //var sql = fs.readFileSync( `${migrationFolder}${file}`, 'utf8' );
    const scriptJs = require( `${migrationFolder}${file}` );
    const scriptFile = new scriptJs( MigrationTools );
    const scripts = await scriptFile.up();
    console.log( `--- Running Migration File ${file}` );
    console.log( scripts )
    for ( var i = 0; i < scripts.length; i++ ) {
      const sql = scripts[ i ];
      console.log( sql );
      const res = await db.any( sql );
      console.log( res );
    }
    return i;
  }

  async executeScript( file ) {
    const sql = fs.readFileSync( `${migrationFolder}${file}`, 'utf8' );
    console.log( `--- Running Migration Script ${file}` );
    console.log( sql );
    const res = await db.any( sql );
    console.log( res );
    return 1;
  }

  async completeMigration( file ) {
    const query2 = `INSERT INTO migrations (migration_name) VALUES ($1)`;
    const res = await db.any( query2, [ file ] );
    return res;
  }

  logError( err ) {
    console.log( '\x1b[31m%s\x1b[0m', err );
  }
}

const migration = new Migration();
console.log( '=========== Running Migrations ===============' );
migration.run();
