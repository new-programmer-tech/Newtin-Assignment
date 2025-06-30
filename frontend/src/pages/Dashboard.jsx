import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', type: 'personal' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    fetchContacts();
  }, [token, navigate]);

  const fetchContacts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/contacts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(res.data.data);
    } catch (err) {
      console.error('Failed to load contacts', err);
      toast.error('Failed to load contacts');
    }
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/contacts/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Contact updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/contacts', form, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Contact added successfully');
      }

      fetchContacts();
      setForm({ name: '', email: '', phone: '', type: 'personal' });
      setEditingId(null);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong');
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = contact => {
    setForm({ name: contact.name, email: contact.email, phone: contact.phone, type: contact.type });
    setEditingId(contact._id);
  };

  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await axios.delete(`http://localhost:5000/api/contacts/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Contact deleted');
        fetchContacts();
      } catch (err) {
        toast.error('Failed to delete contact' ,err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.info('Logged out successfully');
    setTimeout(() => navigate('/'), 1000);
  };

  return (
    <div className="container py-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-primary">Contact Dashboard</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm mb-4">
        <h5 className="mb-3">{editingId ? 'Edit Contact' : 'Add Contact'}</h5>

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="form-control mb-2"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="form-control mb-2"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          className="form-control mb-2"
          value={form.phone}
          onChange={handleChange}
          required
        />
        <select
          name="type"
          className="form-select mb-3"
          value={form.type}
          onChange={handleChange}
        >
          <option value="personal">Personal</option>
          <option value="work">Work</option>
        </select>

        <button type="submit" className="btn btn-success w-100">
          {editingId ? 'Update Contact' : 'Add Contact'}
        </button>
      </form>

      <div className="card shadow-sm p-4">
        <h5>All Contacts</h5>
        {contacts.length === 0 ? (
          <p className="text-muted">No contacts found.</p>
        ) : (
          <ul className="list-group">
            {contacts.map(contact => (
              <li
                key={contact._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{contact.name}</strong><br />
                  <small>{contact.email}</small><br />
                  <small>{contact.phone}</small> - <em>{contact.type}</em>
                </div>
                <div>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(contact)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(contact._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
