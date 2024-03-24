import axios from 'axios'
// const baseUrl = 'https://backend-test-8wcp.onrender.com/api/notes'
const baseUrl = 'http://localhost:3002/api/notes'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}


const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}


const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject).then(response => response.data)
}

export default { getAll, create, update, setToken }