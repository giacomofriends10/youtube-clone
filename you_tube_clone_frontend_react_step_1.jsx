// client/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Watch from './pages/Watch';
import Login from './pages/Login';
import Upload from './pages/Upload';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watch/:id" element={<Watch />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<Upload />} />
      </Routes>
    </BrowserRouter>
  );
}

// ================= components/Navbar.jsx =================
import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <div style={{ padding: 16, display: 'flex', gap: 20, borderBottom: '1px solid #ddd' }}>
      <Link to="/">Home</Link>
      <Link to="/upload">Upload</Link>
      <Link to="/login">Login</Link>
    </div>
  );
}

// ================= pages/Home.jsx =================
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/videos')
      .then(res => res.json())
      .then(setVideos);
  }, []);

  return (
    <div style={{ padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 300px)', gap: 20 }}>
      {videos.map(v => (
        <Link key={v._id} to={`/watch/${v._id}`} style={{ textDecoration: 'none', color: 'black' }}>
          <div>
            <video src={`http://localhost:4000/api/stream/${v._id}`} width="300" />
            <h4>{v.title}</h4>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ================= pages/Watch.jsx =================
import { useParams } from 'react-router-dom';

export default function Watch() {
  const { id } = useParams();

  return (
    <div style={{ padding: 20 }}>
      <video
        src={`http://localhost:4000/api/stream/${id}`}
        width="800"
        controls
        autoPlay
      />
    </div>
  );
}

// ================= pages/Login.jsx =================
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    const res = await fetch('http://localhost:4000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    localStorage.setItem('token', data.token);
    alert('Logged in');
  };

  return (
    <div style={{ padding: 20 }}>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
    </div>
  );
}

// ================= pages/Upload.jsx =================
import { useState } from 'react';

export default function Upload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const upload = async () => {
    const form = new FormData();
    form.append('title', title);
    form.append('description', description);
    form.append('video', file);

    await fetch('http://localhost:4000/api/upload', {
      method: 'POST',
      headers: { Authorization: localStorage.getItem('token') },
      body: form
    });

    alert('Uploaded');
  };

  return (
    <div style={{ padding: 20 }}>
      <input placeholder="Title" onChange={e => setTitle(e.target.value)} />
      <input placeholder="Description" onChange={e => setDescription(e.target.value)} />
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={upload}>Upload</button>
    </div>
  );
}
