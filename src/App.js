import React, { useEffect, useState } from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'

function ProductsCreatePage() {
  // const [form, setForm] = useState({name:"", description:"", price:"", category: ""})
  const [data, setData] = useState()

  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetch("http://localhost:5000/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
  }, [])

  const handleSubmit = () => {
    fetch("http://localhost:5000/products", {
      method: "POST",
      body: JSON.stringify(form)
    })
    .then(response => response.json())
    .then(() => window.location = "/foo")
  }

  return (
    <form onSubmit={handleSubmit}>
    <div>
      <label>Nam  e</label>
      <input onChange={e => setForm({...form, name: e.target.value})} value={form.name} />
    </div>
      <div>
        <label>Name</label>
        <input onChange={e => setForm({...form, name: e.target.value})} value={form.name} />
      </div>
      <div>
        <label>description</label>
        <input onChange={e => setForm({...form, description: e.target.value})} value={form.description} />
      </div>
      <div>
        <label>quantity</label>
        <input onChange={e => setForm({...form, quantity: e.target.value})} value={form.quantity} />
      </div>
      <div>
        <label>Categories</label>
        <select>
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </select>
      </div>
    </form>
  )
}

function ProductsIndexPage() {
  const [products, setProducts] = useState([])
  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then(res => res.json())
      .then(data => setProducts(data))
  }, [])

  return (
    <>
      {products.map(product => (
        <div>
          <h2>{product.name}</h2>
          <h5>{product.category.name}</h5>
          <p>{product.description}</p>
          <p>Only {product.quantity} left</p>
        </div>
      ))}
    </>
  )
}

function CategoriesIndexPage() {
  const [categories, setCategories] = useState([])
  
  useEffect(() => {
    fetch("http://localhost:5000/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
  }, [])

  return (
    <div>
      {categories.map(category => (
        <Link to={`/category/${category._id}/products`}>Show all {category.name} goods</Link>
      ))}
    </div>
  )
}

function CategoryProductsPage() {
  return (
    <div>
      <h2>Product Name</h2>
      <h5>Category</h5>
      <p>description</p>
      <p>Only quantity left</p>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Link to="/products">All Products</Link>
      <Link to="/products/new">Create Product</Link>
      <Link to="/categories">All Categories</Link>
      <Route exact path="/products" render={ProductsIndexPage}/>
      <Route exact path="/products/new" render={ProductsCreatePage}/>
      <Route exact path="/categories" render={CategoriesIndexPage}/>
      <Route exact path="/categories/:id/products" render={CategoryProductsPage}/>
    </Router>
  );
}

export default App;
