const CommentsLikeHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'commentLikes',
  register: async (server, { container }) => {
    const commentsLikeHandler = new CommentsLikeHandler(container);
    server.route(routes(commentsLikeHandler));
  },
};
