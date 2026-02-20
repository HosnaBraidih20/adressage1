import React, { useState, useEffect } from 'react';
import { useKeycloak } from '../context/KeycloakContext';
import UserInfo from '../components/auth/UserInfo';
import axios from 'axios';
import Swal from 'sweetalert2';

/**
 * Admin Dashboard Component
 * Shows admin-only information and statistics
 */
const AdminDashboard = () => {
  const { user, token } = useKeycloak();
  const [stats, setStats] = useState(null);
  const [citoyens, setCitoyens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAdminData();
  }, [token]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Fetch statistics
      const statsResponse = await axios.get('http://localhost:8081/api/admin/statistics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(statsResponse.data);

      // Fetch all citoyens
      const citoyensResponse = await axios.get('http://localhost:8081/api/admin/citoyens', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCitoyens(citoyensResponse.data);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      Swal.fire('Error', 'Failed to load admin data', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">🛡️ Admin Dashboard</h1>
        <p className="text-indigo-100">Welcome back, {user?.name}!</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b-2 border-gray-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'overview'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📊 Overview
        </button>
        <button
          onClick={() => setActiveTab('citoyens')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'citoyens'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          👥 Citizens
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'profile'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          👤 Profile
        </button>
      </div>

      {/* Content */}
      <div>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Statistics Cards */}
                <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                  <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Citizens</h3>
                  <p className="text-3xl font-bold text-indigo-600">{stats.totalCitoyens}</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                  <h3 className="text-gray-600 text-sm font-semibold mb-2">Last Updated</h3>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(stats.timestamp).toLocaleString()}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                  <h3 className="text-gray-600 text-sm font-semibold mb-2">Retrieved By</h3>
                  <p className="text-lg font-bold text-gray-900">{stats.retrievedBy}</p>
                </div>
              </div>
            )}

            {/* Citizens Tab */}
            {activeTab === 'citoyens' && (
              <div className="bg-white rounded-lg shadow p-6 border border-gray-200 overflow-x-auto">
                <h3 className="text-lg font-bold mb-4">All Citizens</h3>
                
                {citoyens.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No citizens found</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">ID</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Email</th>
                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {citoyens.map((citoyen) => (
                        <tr key={citoyen.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2 text-gray-900">{citoyen.id}</td>
                          <td className="px-4 py-2 text-gray-900">
                            {citoyen.nom} {citoyen.prenom}
                          </td>
                          <td className="px-4 py-2 text-gray-600">{citoyen.cin}</td>
                          <td className="px-4 py-2 text-gray-600">{citoyen.telephone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && <UserInfo />}
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={fetchAdminData}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          disabled={loading}
        >
          🔄 Refresh Data
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
