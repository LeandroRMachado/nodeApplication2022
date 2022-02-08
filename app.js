const fs = require('fs')
const express = require('express')
const { randomUUID } = require('crypto')

const app = express()

app.use(express.json())

// app.get('/primeira-rota', (request, response) => {
//   return response.json({
//     message: 'Acessou a primeira rota com nodemon'
//   })
// })

let products = []

fs.readFile('products.json', 'utf-8', (err, data) => {
  if (err) {
    console.log(err)
  } else {
    products = JSON.parse(data)
  }
})

/**           METODOS
 
 * POST   => Inserir um dado
 * GET    => Buscar um/mais dados
 * PUT    => Alterar um dado
 * DELETE => Remover um dado
 */

/**     Infomações vindo do nosso request

 * Body   => passando informações no corpo da minha requisição
 * Query  => fazem parte da rota, mas não são obrigatórios
 * Params => é o que vem na minha URL, também conhecidos como parametros de rota
 */

app.post('/products', (request, response) => {
  // nosso produto terá nome e preço => name and price

  const { name, price } = request.body

  const product = {
    name,
    price,
    id: randomUUID()
  }
  products.push({ product })

  productFile()

  return response.json(product)
})

app.get('/products', (request, response) => {
  return response.json(products)
})

app.get('/products/:id', (request, response) => {
  const { id } = request.params
  const product = products.find(product => product.id === id)

  return response.json(product)
})

app.put('/products/:id', (request, response) => {
  const { id } = request.params
  const { name, price } = request.body

  const productIndex = products.findIndex(product => product.id === id)
  products[productIndex] = {
    ...products[productIndex],
    name,
    price
  }
  productFile()

  return response.json({ message: 'Produto alterado com sucesso' })
})

app.delete('/products/:id', (request, response) => {
  const { id } = request.params

  const productIndex = products.findIndex(product => product.id === id)

  products.splice(productIndex, 1)

  productFile()

  return response.json({ message: 'Produto excluído com sucesso' })
})

function productFile() {
  fs.writeFile('products.json', JSON.stringify(products), err => {
    if (err) {
      console.log(err)
    } else {
      console.log('Produto inserido')
    }
  })
}

app.listen(4002, () => console.log('Server is running on PORT 4002'))
