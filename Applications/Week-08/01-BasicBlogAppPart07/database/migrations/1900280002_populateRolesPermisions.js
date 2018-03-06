const TABLENAME = 'users';
const roles = [ {
    role: 'admin',
    description: 'Power user. Has all rights.'
},
  {
    role: 'everyone',
    description: 'Given to all users by default. Basic access (register, login, logout, token)'
},
  {
    role: 'subscriber',
    description: 'Lowest user role. Read-only access.'
},
  {
    role: 'publisher',
    description: 'User can read all posts. User can create posts, and edit or delete their own posts.'
} ];

const permissions = [ {
    permission: '/user/register',
    description: 'Create an account.'
},
  {
    permission: '/user/login',
    description: 'Login to site'
},
  {
    permission: '/user/logout',
    description: 'Logout of site'
},
  {
    permission: '/user/token',
    description: 'Refresh access token'
},
  {
    permission: 'GET /post/*',
    description: 'Retrieve all posts to read'
},
  {
    permission: 'POST,PUT,DEL /post/*',
    description: 'Create, edit, or delete a post'
} ];

const rolesPermissions = [
[ 1, 5 ], [ 1, 6 ], // admin
[ 2, 1 ], [ 2, 2 ], [ 2, 3 ], [ 2, 4 ], // everyone
[ 3, 5 ], // subscriber
[ 4, 5 ], [ 4, 6 ] // publisher
];

class MigrationFile {
  constructor( migration ) {
    this.m = migration;
    console.log( 'constructor', this.m )
  }

  async up() {
    const roleIds = [];
    const permissionIds = [];
    // insert roles, save new ids
    for ( let i = 0; i < roles.length; i++ ) {
      const role = roles[ i ];
      const script =
        `INSERT INTO roles (role, description) VALUES  ('${role.role}', '${role.description}') RETURNING id`;
      const id = await this.m.db.one( script );
      roleIds.push( id );
    }
    // insert permissions, save new ids
    for ( let i = 0; i < permissions.length; i++ ) {
      const per = permissions[ i ];
      const script =
        `INSERT INTO permissions (permission, description) VALUES ('${per.permission}', '${per.description}') RETURNING id`;
      const id = await this.m.db.one( script );
      permissionIds.push( id );
    }
    // generate scripts for linking table and return
    let script = `INSERT INTO roles_permissions (roles_id, permissions_id) VALUES `
    for ( let i = 0; i < rolesPermissions.length; i++ ) {
      const rp = rolesPermissions[ i ];
      script += `(${roleIds[rp[0]-1].id}, ${permissionIds[rp[1]-1].id})`;
      if ( i < rolesPermissions.length - 1 ) {
        script += ', ';
      }
    }
    console.log( script )
    return [ script ];
  }

  async down() {

  }
}

module.exports = MigrationFile;
