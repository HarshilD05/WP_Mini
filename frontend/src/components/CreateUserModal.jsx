import React, { useState } from 'react';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import './CreateUserModal.css';

const roleOptions = [
  { value: 'lead', label: 'Lead' },
  { value: 'chairperson', label: 'Chairperson' },
  { value: 'faculty coordinator', label: 'Faculty Coordinator' },
  { value: 'tpo', label: 'TPO' },
  { value: 'vice principal', label: 'Vice Principal' },
  { value: 'principal', label: 'Principal' }
];

const CreateUserModal = ({ onClose, onCreate, initialCommittees = [] }) => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    committee: '',
    role: '',
    password: '',
    confirmPassword: '',
    imageFile: null
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageFile') {
      const file = files[0];
      if (file) {
        const allowed = ['image/png','image/jpeg','image/jpg'];
        if (!allowed.includes(file.type)) {
          setError('Only PNG/JPEG/JPG images are allowed');
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          setError('Image size must be less than 2MB');
          return;
        }
        setFormData(prev => ({ ...prev, imageFile: file }));
        setError('');
      }
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validate = () => {
    if (!formData.email || !formData.name || !formData.role) {
      setError('Please fill required fields');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (formData.password && formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setSubmitting(true);
    try {
      // We'll send FormData upwards; parent can call API
      const payload = { ...formData };
      onCreate(payload);
    } catch (err) {
      setError(err.message || 'Error creating user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e)=>e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create New User</h3>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="row">
            <div className="col">
              <label>Name</label>
              <input name="name" type="text" value={formData.name} onChange={handleChange} required />
            </div>
          </div>

          <div className="row">
            <div className="col">
              <label>Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="row">
            <div className="col">
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleChange} required>
                <option value="">Select Role</option>
                {roleOptions.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            {(formData.role === 'lead' || formData.role === 'chairperson') && (
              <div className="col">
                <label>Committee</label>
                <select name="committee" value={formData.committee} onChange={handleChange}>
                  <option value="">Select Committee</option>
                  {initialCommittees.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="row">
            <div className="col">
              <label>Password</label>
              <input name="password" type="password" value={formData.password} onChange={handleChange} />
            </div>
          </div>

          <div className="row">
            <div className="col">
              <label>Confirm Password</label>
              <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} />
            </div>
          </div>

          <div className="row">
            <div className="col">
              <label>Upload Signature (PNG/JPG, &lt;=2MB)</label>
              <input name="imageFile" type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleChange} />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-cancel" onClick={onClose} disabled={submitting}>Cancel</button>
            <button type="submit" className="btn btn-submit" disabled={submitting}>{submitting ? 'Creating...':'Create User'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
