import { faker } from '@faker-js/faker'
import * as fs from 'fs'

// number of products to generate
const NUM_OF_PRODUCTS = 1000

// generate fake data
const generateData = (count: number) => {
  const data = []
  for (let i = 0; i < count; i++) {
    const product = {
      id: faker.string.alphanumeric(10).toUpperCase(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription()
    }
    data.push(product)
  }
  return data
}
// write nicely formatted json into products.json file
fs.writeFileSync('products.json', JSON.stringify(generateData(NUM_OF_PRODUCTS), null, 2))
console.log(`Generated ${NUM_OF_PRODUCTS} products into products.json`)
