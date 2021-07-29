const AWS = require('aws-sdk')
const { unmarshall } = AWS.DynamoDB.Converter
const DynamoDB = new AWS.DynamoDB.DocumentClient()

module.exports.addOrder = async (event) => {
  console.log('HERE! HERE!', event)
  const { total, amount, client } = JSON.parse(event.body)
  const now = new Date()
  const clientName = client.name
  const id = [clientName, now.toISOString()].join('-')
  // Dynamo stuff goes here
  const params = {
    // TODO this doesn't look good (hardcoded)
    TableName: 'orders-dev',
    Item: {
      id,
      total,
      amount,
      clientName
    }
  }
  await DynamoDB.put(params).promise()

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        id
      }
    )
  }
}


module.exports.getOrder = async (event) => {
  console.log('GET ORDER!', event)
  const { id } = event.pathParameters
  const params = {
    TableName: 'orders-dev',
    Key: { id }
  }
  const result = await DynamoDB.get(params).promise()
  const { total, amount, clientName } = result.Item
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        total,
        amount,
        clientName
      }
    )
  }
}
