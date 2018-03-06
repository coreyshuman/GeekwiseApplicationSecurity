const USERTABLE = 'users';
const POSTTABLE = 'posts';

class MigrationFile {
  constructor( migration ) {
    this.m = migration;
    console.log( 'constructor', this.m )
  }

  async up() {
    const minPosts = 0;
    const maxPosts = 3;
    const seeds = [];
    let insert = `INSERT INTO ${POSTTABLE} (title, post, user_id, created_at, updated_at) VALUES `;
    // get users
    const userIds = await this.m.db.any( `SELECT id FROM ${USERTABLE}` );
    for ( let ui = 0; ui < userIds.length; ui++ ) {
      const postCount = this.m.util.random.int( minPosts, maxPosts );
      if ( postCount ) {
        let script = '' + insert;
        for ( let i = 1; i <= postCount; i++ ) {
          const values =
            `('${this.m.seed.lorem(1,1)}', '${this.m.seed.paragraph(1,3)}', '${userIds[ui].id}', '${this.m.seed.dateFriendly()}', '${this.m.seed.dateFriendly()}')`;
          script += values;
          if ( i < postCount ) {
            script += ', ';
          }
        }
        seeds.push( script );
      }
    }

    return seeds;
  }

  async down() {

  }
}

module.exports = MigrationFile;
