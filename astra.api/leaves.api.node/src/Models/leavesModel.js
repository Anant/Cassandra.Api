module.exports = {
  fields:{
    is_archived: 'int',
    all: {
      type: 'list',
      typeDef: '<text>'
    },
    is_starred: 'int',
    user_name: 'text',
    user_email: 'text',
    user_id: 'int',
    tags: {
      type: 'list',
      typeDef: '<text>'
    },
    slugs: {
      type: 'list',
      typeDef: '<text>'
    },
    is_public: 'boolean',
    id: 'int',
    title: 'text',
    url: 'text',
    content_text: 'text',
    created_at: 'timestamp',
    updated_at: 'timestamp',
    mimetype: 'text',
    language: 'text',
    reading_time: 'int',
    domain_name: 'text',
    preview_picture: 'text',
    http_status: 'text',
    links: {
      type: 'list',
      typeDef: '<text>'
    },
    content: 'text'
  },
  key:['id']
};
