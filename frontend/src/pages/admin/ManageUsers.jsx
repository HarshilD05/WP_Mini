import React, { useEffect, useState } from 'react';
import './ManageUsers.css';
import { getUsers, createUser, filterUsers } from '../../apis/adminAPI';
import CreateUserModal from '../../components/CreateUserModal';
import { useNavigate } from 'react-router-dom';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('');
  const [query, setQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [committees] = useState(['ACM','Synapse','Cultural','Technical']);
  const navigate = useNavigate();

  useEffect(()=>{
    const load = async ()=>{
      const data = await getUsers();
      setUsers(data);
    };
    load();
  },[]);

  const applyFilter = async ()=>{
    const res = await filterUsers({ role: filterRole, q: query });
    setUsers(res);
  };

  const handleCreate = async (payload) => {
    await createUser(payload);
    const data = await getUsers();
    setUsers(data);
    setShowCreate(false);
  };

  return (
    <div className="manage-users-page">
      <div className="manage-header">
        <h2>Manage Users</h2>
        <div className="manage-actions">
          <input placeholder="Search name or email" value={query} onChange={(e)=>setQuery(e.target.value)} />
          <select value={filterRole} onChange={(e)=>setFilterRole(e.target.value)}>
            <option value="">All Roles</option>
            <option value="lead">Lead</option>
            <option value="chairperson">Chairperson</option>
            <option value="faculty coordinator">Faculty Coordinator</option>
            <option value="tpo">TPO</option>
            <option value="vice principal">Vice Principal</option>
            <option value="principal">Principal</option>
          </select>
          <button onClick={applyFilter} className="btn">Filter</button>
          <button onClick={()=>setShowCreate(true)} className="btn primary">Create New User</button>
        </div>
      </div>

      <div className="user-grid">
        {users.map(u=> (
          <div key={u.id} className="user-card" onClick={()=>navigate(`/admin/user/${u.id}`)}>
            <div className="avatar">{u.name.charAt(0)}</div>
            <div className="user-info">
              <h4>{u.name}</h4>
              <small>{u.email}</small>
              <div className="meta">{u.committee} • {u.role}</div>
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <CreateUserModal onClose={()=>setShowCreate(false)} onCreate={handleCreate} initialCommittees={committees} />
      )}
    </div>
  );
};

export default ManageUsers;
