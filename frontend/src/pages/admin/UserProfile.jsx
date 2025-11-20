import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UserProfile.css';
import { getUserById } from '../../apis/adminAPI';

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(()=>{
    const load = async ()=>{
      const u = await getUserById(id);
      setUser(u);
    };
    load();
  },[id]);

  if (!user) return <div className="user-profile-page"><p>Loading...</p></div>;

  return (
    <div className="user-profile-page">
      <button className="back-btn" onClick={()=>navigate(-1)}>← Back</button>
      <div className="profile-card">
        <div className="profile-avatar">{user.name.charAt(0)}</div>
        <div className="profile-info">
          <h2>{user.name}</h2>
          <p className="muted">{user.email}</p>
          <div className="meta">{user.committee} • {user.role}</div>

          {user.image && <div className="signature"><img src={user.image} alt="signature" /></div>}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
