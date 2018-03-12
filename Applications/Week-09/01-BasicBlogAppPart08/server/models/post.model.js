class Post {
  constructor( obj ) {
    obj && Object.assign( this, obj );
    let a = this.created_at;
    this.created_at =
      `${a.getFullYear()}/${a.getMonth()<9?'0':''}${a.getMonth()+1}/${a.getDate()} ${a.getHours()}:${a.getMinutes()}`;
    a = this.updated_at;
    this.updated_at =
      `${a.getFullYear()}/${a.getMonth()<9?'0':''}${a.getMonth()+1}/${a.getDate()} ${a.getHours()}:${a.getMinutes()}`;
  }

  toString() {
    return ``;
  }
}

module.exports = Post;
