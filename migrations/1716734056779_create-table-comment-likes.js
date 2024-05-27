/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('comment_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  // Add a unique constraint to prevent a user from liking the same comment multiple times
  pgm.addConstraint('comment_likes', 'unique_user_id_comment_id', {
    unique: ['user_id', 'comment_id'],
  });

  // Add foreign key constraints
  pgm.addConstraint('comment_likes', 'fk_comment_likes.user_id_users.id', {
    foreignKeys: {
      columns: 'user_id',
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
  });

  pgm.addConstraint(
    'comment_likes',
    'fk_comment_likes.comment_id_comments.id',
    {
      foreignKeys: {
        columns: 'comment_id',
        references: 'comments(id)',
        onDelete: 'CASCADE',
      },
    },
  );
};

exports.down = (pgm) => {
  pgm.dropTable('comment_likes');
};
