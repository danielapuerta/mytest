exports.up = async knex => {
    await knex.schema.createTable("residents", (table)=> {
          table.increments("id");
          table.string("fullName");
          table.integer("age");
          table.integer("roomNumber");
          table.timestamp('created_at').defaultTo(knex.fn.now());
          table.timestamp('updated_at').defaultTo(knex.fn.now());
          }
      )
  };
  
  exports.down = async knex => {
      await knex.schema.dropTableIfExists("residents")
  };