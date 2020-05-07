import axios from 'axios'

const http = axios.create({
  baseURL: 'http://localhost:3000/admin/api',
})

const musicHttp = axios.create({
  baseURL: '/musicsearch',
})

export { http, musicHttp }
