const { Client } = require('pg')
const connectionString = 'postgresql://whitney:@localhost:5432/bball'

var query = async (text, values) => {
  const client = new Client({connectionString})
  await client.connect()

  var response = await client.query(text, values)
  // console.log(response)

  await client.end()

    // return response.rows[0]
    return response

}

module.exports.query = query;
