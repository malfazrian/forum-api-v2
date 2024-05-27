const RepliesCommentHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'replyComments',
  register: async (server, { container }) => {
    const repliesCommentHandler = new RepliesCommentHandler(container);
    server.route(routes(repliesCommentHandler));
  },
};
