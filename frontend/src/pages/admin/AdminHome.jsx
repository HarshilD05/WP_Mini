import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getAdminStats } from '../../apis/adminStatsAPI';
import './AdminHome.css';

const COLORS = {
  students: '#3b82f6',
  teachers: '#10b981',
  pending: '#f59e0b',
  approved: '#10b981',
  rejected: '#ef4444'
};

const AdminHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        console.error('Error loading stats:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="admin-home-page">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
        </div>
        <p style={{color: '#fff'}}>Loading...</p>
      </div>
    );
  }

  const userColors = [COLORS.students, COLORS.teachers];
  const requestColors = [COLORS.pending, COLORS.approved, COLORS.rejected];

  return (
    <div className="admin-home-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
      </div>

      <div className="admin-stats-row">
        <div className="stat-card">
          <h3>Users Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats.userDistribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {stats.userDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={userColors[index % userColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h3>Requests This Month</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={stats.requestsThisMonth}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {stats.requestsThisMonth.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={requestColors[index % requestColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="stat-card">
          <h3>Total Requests</h3>
          <div className="count-large">{stats.totalRequests}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
