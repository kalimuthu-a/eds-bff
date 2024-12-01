
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8081;

const SELLER_API = 'https://jsonplaceholder.typicode.com/users';
const PRODUCTS_API = 'https://fakestoreapi.com/products';

app.get('/get-products', async (req, res) => {
  try {
    // Fetch data from public APIs
    const [ sellerResponse, productsResponse ] = await Promise.all([
      fetch(SELLER_API),
      fetch(PRODUCTS_API),
    ]);

    if (!sellerResponse.ok || !productsResponse.ok) {
      throw new Error('Failed to fetch data from one or both APIs');
    }

    const sellerData = await sellerResponse.json();
    const productsData = await productsResponse.json();

    // Data Massaging: Combine and filter data from both sources
    const combinedData = productsData.map((product, index) => ({
      ...product,
      productId: product.id,
      title: product.title, // From Products API
      price: product.price, // From Products API
      description: product.description, // From Products API
      seller: sellerData[ index ]?.name || 'Seller info not available',
      sellerEmail: sellerData[ index ]?.email || 'Seller info not available',
    }));

    // Log the combined data for debugging
    // console.log('Transformed Data:', combinedData);
    res.send(combinedData)
  } catch (error) {
    console.log(error);
    res.status(400).send('Error while getting list of products..');
  }
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});