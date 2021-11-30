/* istanbul ignore file */
const { pool } = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async findCommentById(id) {
    const query = {
      text: `SELECT * 
              FROM comments
              WHERE id = $1`,
      values: [id],
    };

    const { rows } = await pool.query(query);
    return rows;
  },

  async cleanTabel() {
    await pool.query(`DELETE FROM comments
                      WHERE 1=1`);
  },
};

module.exports = { CommentsTableTestHelper };
