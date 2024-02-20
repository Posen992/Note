import axios from 'axios'
const baseUrl = 'https://note-backend-test-8wcp.onrender.com/api/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  // const nonExisting = {
  //   id: 10000,
  //   content: 'This note is not saved to server',
  //   important: true,
  // }
  return request.then(response => response.data)
}

const create = newObject => {
  return axios.post(baseUrl, newObject).then(response => response.data)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject).then(response => response.data)
}

export default { 
  getAll: getAll, 
  create: create, 
  update: update 
}