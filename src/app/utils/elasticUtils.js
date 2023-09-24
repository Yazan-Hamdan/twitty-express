import client from '@core/elasticSearch'

export const search = async (object) => {
  const {
    index,
    body
  } = object

  const response = await client.search({
    index: index,
    body
  })
  return response?.body;
}