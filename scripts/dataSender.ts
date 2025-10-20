import axios from 'axios'
import * as fs from 'fs'

const FormData = require('form-data')

const form = new FormData()
form.append('products', fs.createReadStream('products.json'))

axios
  .post('http://localhost:3000/api/v1/products', form, {
    headers: form.getHeaders()
  })
  .then((res) => {
    console.log(`Products uploaded successfully`)
  })
  .catch((err) => {
    console.error(`Error uploading products, reason: ${err.message}`)
  })
