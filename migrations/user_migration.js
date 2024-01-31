exports.up = async knex => {
    await knex.schema.createTable("users", (table)=> {
          table.increments("id");
          table.string("nursecode");
          table.string("password_hash")
          }
      )
  };
  
  exports.down = async knex => {
      await knex.schema.dropTableIfExists("users")
  };