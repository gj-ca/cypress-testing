import React, { useEffect, useState } from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'

function ProductsCreatePage() {
  const [form, setForm] = useState({name:"", description:"", quantity:"", category: ""})
  const [categories, setCategories] = useState([])
  const [image, setImage] = useState("")

  useEffect(() => {
    fetch("http://localhost:5000/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
  }, [])

  const handleSubmit = e => {
    e.preventDefault()
    let formData = new FormData()
    formData.append("name", form.name)
    formData.append("description", form.description)
    formData.append("quantity", form.quantity)
    formData.append("category", form.category)
    formData.append("image", image)
    
    fetch("http://localhost:5000/products", {
      method: "POST",
      body: formData
    })
    .then(response => response.json())
    .then(() => {})
  }

  const handleChange = e => {
    // console.log(e.target.files[0])
    setImage(e.target.files[0])
  }

  return (
    <form onSubmit={handleSubmit}>
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
        <select
          value={form.category._id} 
          onChange={e => setForm({...form, category: e.target.value})}
          >
          {categories.map(category => (
            <option 
            key={category._id} 
            value={category._id}>{category.name}</option>
          ))}
        </select>
      </div>
      <div>
          <label>Image Upload:</label>
          <input 
            type="file"
            name="image"
            onChange={handleChange}
          />
        </div>
      <button>Submit</button>
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
          {console.log(product)}
          <h2>{product.name}</h2>
          <h5>{product.category && product.category.name}</h5>
          <p>{product.description}</p>
          <img src={product.imageUrl} />
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

function LoginPage({setAuthenticated, setUser}) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = e => {
    e.preventDefault()
    fetch("http://localhost:5000/users/login", {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({username, password})
    })
    .then(result => {
      if (result.status == 200) {
        setAuthenticated(true)
        return result.json()
      }})
      .then(user => {
        setUser(user)
      }) 
    .catch(err => console.log(err))
  }
  
  return (
    <>
      <h1>Log In Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>username</label>
          <input value={username} onChange={e => setUsername(e.target.value)}/>
        </div>
        <div>
          <label>password</label>
          <input value={password} onChange={e => setPassword(e.target.value)}/>
        </div>
        <div>
          <button>Submit</button>
        </div>
      </form>
    </>
  )
}

function SignUpPage({setAuthenticated, setUser}) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = e => {
    e.preventDefault()
    fetch("http://localhost:5000/users/sign_up", {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({username, password})
    })
    .then(result => setAuthenticated(true))
    .catch(err => console.log(err))
  }
  
  return (
    <>
      <h1>Sign Up Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>username</label>
          <input value={username} onChange={e => setUsername(e.target.value)}/>
        </div>
        <div>
          <label>password</label>
          <input value={password} onChange={e => setPassword(e.target.value)}/>
        </div>
        <div>
          <button>Submit</button>
        </div>
      </form>
    </>
  )
}

function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetch("http://localhost:5000/users/me", {
      credentials: "include"
    })
    .then(data => data.json())
    .then(user => {
      setAuthenticated(true)
      setUser(user)
    })
    .catch(err => console.log(err))
  }, [])

  const handleLogout = () => {
    fetch("http://localhost:5000/users/logout", {
      credentials: "include"
    })
    .then(() => {
      setAuthenticated(false)
      setUser(null)
    })
    .catch(err => console.log(err))
  }
  
  return (
    <Router>
      <h1>You are {authenticated ? "authenticated" : "not authenticated"}</h1>
      {user && <h2>You are {user.username}</h2>}
      <Link to="/products">All Products</Link>
      <Link to="/products/new">Create Product</Link>
      <Link to="/categories">All Categories</Link>
      {authenticated ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <>
          <Link to='/login'>Login</Link>
          <Link to='/sign_up'>Sign Up</Link>
        </>
      )}
      <Route exact path="/products" component={ProductsIndexPage}/>
      <Route exact path="/products/new" component={ProductsCreatePage}/>
      <Route exact path="/categories" component={CategoriesIndexPage}/>
      <Route exact path="/categories/:id/products" component={CategoryProductsPage}/>
      <Route exact path="/login" render={() => <LoginPage setAuthenticated={setAuthenticated} setUser={setUser} />} />
      <Route exact path="/sign_up" render={() => <SignUpPage setAuthenticated={setAuthenticated} setUser={setUser} />} />
    </Router>
  );
}

export default App;
