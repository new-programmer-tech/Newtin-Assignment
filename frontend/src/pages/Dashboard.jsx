import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', type: 'personal' });
  const [filter, setFilter] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchContacts = useCallback(() => {
    const query = filter ? `?type=${filter}` : '';
    axios.get(`http://localhost:5000/api/contacts${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setContacts(res.data.data))
    .catch((err) => console.error('Fetch failed', err));
  }, [token, filter]);

  useEffect(() => {
    if (!token) navigate('/');
    else fetchContacts();
  }, [fetchContacts, token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/contacts/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage('Contact updated');
      } else {
        await axios.post(`http://localhost:5000/api/contacts`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage('Contact added');
      }
      setForm({ name: '', email: '', phone: '', type: 'personal' });
      setEditingId(null);
      fetchContacts();
    } catch (err) {
      setError(err.response?.data?.message || 'Error');
    }
  };

  const handleEdit = (contact) => {
    setForm(contact);
    setEditingId(contact._id);
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this contact?')) {
      await axios.delete(`http://localhost:5000/api/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Contact deleted');
      fetchContacts();
    }
  };

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage('');
        setError('');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);


  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Contact Manager</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form className="card p-3 mb-3" onSubmit={handleSubmit}>
        <h5>{editingId ? 'Edit Contact' : 'Add Contact'}</h5>
        <input className="form-control mb-2" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input className="form-control mb-2" name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input className="form-control mb-2" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} required />
        <select className="form-select mb-2" name="type" value={form.type} onChange={handleChange}>
          <option value="personal">Personal</option>
          <option value="work">Work</option>
        </select>
        <button className="btn btn-primary" type="submit">{editingId ? 'Update' : 'Add'} Contact</button>
      </form>

      <div className="mb-3">
        <label>Filter by Type:</label>
        <select className="form-select w-auto d-inline-block ms-2" onChange={(e) => setFilter(e.target.value)}>
          <option value="">All</option>
          <option value="personal">Personal</option>
          <option value="work">Work</option>
        </select>
      </div>
      {contacts.length === 0 && (
  <div className="alert alert-info">
    No contacts found{filter ? ` for "${filter}" type` : ''}.
  </div>
)}

<ul className="list-group">
  {contacts.map((c) => (
    <li key={c._id} className="list-group-item d-flex justify-content-between align-items-center">
      <div>
        <strong>{c.name}</strong><br />
        <small>{c.email}</small> | {c.phone} ({c.type})
      </div>
      <div>
        <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(c)}>Edit</button>
        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c._id)}>Delete</button>
      </div>
    </li>
  ))}
</ul>


    </div>
  );
};

export default Dashboard;