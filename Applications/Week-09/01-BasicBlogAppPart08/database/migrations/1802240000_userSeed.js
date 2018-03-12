const TABLENAME = 'users';

class MigrationFile {
  constructor( migration ) {
    this.m = migration;
    console.log( 'constructor', this.m )
  }

  async up() {
    const N = 20;
    const seeds = [];
    let script = `INSERT INTO ${TABLENAME} (username, email, password) VALUES `;
    for ( let i = 1; i <= N; i++ ) {
      const password = await this.m.bcrypt.hash( this.m.seed.word( 8, 16 ), 8 );
      const values = `('${this.m.seed.name.en()}', '${this.m.seed.email()}', '${password}')`;
      script += values;
      if ( i < N ) {
        script += ', ';
      }
    }
    seeds.push( script );
    return seeds;
  }

  async down() {

  }
}

module.exports = MigrationFile;
