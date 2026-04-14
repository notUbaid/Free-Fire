"use client";

import { useState } from "react";

interface Registration {
  id: string;
  team_name: string;
  leader_name: string;
  leader_email: string;
  leader_phone: string;
  leader_school: string;
  player2_name: string;
  player2_phone: string;
  player2_school: string;
  player3_name: string;
  player3_phone: string;
  player3_school: string;
  player4_name: string | null;
  player4_phone: string | null;
  player4_school: string | null;
  approved: boolean;
  created_at: string;
}

function AdminPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  const checkPassword = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations);
        setAuthenticated(true);
      } else {
        setError("Invalid password");
      }
    } catch (err) {
      setError("Something went wrong");
    }
    setLoading(false);
  };

  const deleteRegistration = async (id: string) => {
    if (!confirm("Delete this registration?")) return;
    const res = await fetch("/api/admin-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password }),
    });
    if (res.ok) {
      setRegistrations(registrations.filter((r) => r.id !== id));
    }
  };

  const approveTeam = async (id: string) => {
    const res = await fetch("/api/admin-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, data: { approved: true }, password }),
    });
    if (res.ok) {
      setRegistrations(registrations.map(r => r.id === id ? { ...r, approved: true } : r));
    }
  };

  const unapproveTeam = async (id: string) => {
    if (!confirm("Remove from scoreboard? This will hide them from /scoremanager and /score")) return;
    const res = await fetch("/api/admin-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, data: { approved: false }, password }),
    });
    if (res.ok) {
      setRegistrations(registrations.map(r => r.id === id ? { ...r, approved: false } : r));
    }
  };

  const startEdit = (reg: Registration) => {
    setEditingId(reg.id);
    setEditData({ ...reg });
  };

  const saveEdit = async () => {
    const res = await fetch("/api/admin-update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingId, data: editData, password }),
    });
    if (res.ok) {
      setRegistrations(registrations.map(r => r.id === editingId ? editData : r));
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-xl w-full max-w-md">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">🔐 Admin Login</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && checkPassword()}
            placeholder="Enter admin password"
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ringring-orange-500"
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            onClick={checkPassword}
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Checking..." : "Login"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8">
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">📊 Admin Panel</h1>
          <button onClick={() => window.location.reload()} className="text-orange-500 text-sm hover:underline">
            Refresh
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left p-3 text-gray-400 font-medium">Team</th>
                <th className="text-left p-3 text-gray-400 font-medium">Status</th>
                <th className="text-left p-3 text-gray-400 font-medium">Leader</th>
                <th className="text-left p-3 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <>
                  <tr key={reg.id} className="border-t border-gray-700">
                    <td className="p-3 text-orange-500 font-bold">{reg.team_name}</td>
                    <td className="p-3">
                      <button
                        onClick={() => reg.approved ? unapproveTeam(reg.id) : approveTeam(reg.id)}
                        className={`px-2 py-1 rounded text-xs ${
                          reg.approved ? "bg-green-600 text-white" : "bg-yellow-600 text-black"
                        }`}
                      >
                        {reg.approved ? "✓ Approved" : "Pending"}
                      </button>
                    </td>
                    <td className="p-3 text-white">{reg.leader_name}</td>
                    <td className="p-3">
                      <button
                        onClick={() => setExpandedId(expandedId === reg.id ? null : reg.id)}
                        className="text-blue-400 hover:text-blue-300 text-xs mr-2"
                      >
                        {expandedId === reg.id ? "Hide" : "View"} Details
                      </button>
                      <button
                        onClick={() => startEdit(reg)}
                        className="text-yellow-400 hover:text-yellow-300 text-xs mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteRegistration(reg.id)}
                        className="text-red-500 hover:text-red-400 text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  {expandedId === reg.id && (
                    <tr key={reg.id + "-details"} className="bg-gray-800/50">
                      <td colSpan={4} className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-orange-500 font-bold mb-2">Leader</h4>
                            <p className="text-white">Name: {reg.leader_name}</p>
                            <p className="text-white">Email: {reg.leader_email}</p>
                            <p className="text-white">Phone: {reg.leader_phone}</p>
                            <p className="text-white">School: {reg.leader_school}</p>
                          </div>
                          <div>
                            <h4 className="text-orange-500 font-bold mb-2">Player 2</h4>
                            <p className="text-white">Name: {reg.player2_name}</p>
                            <p className="text-white">Phone: {reg.player2_phone}</p>
                            <p className="text-white">School: {reg.player2_school}</p>
                          </div>
                          <div>
                            <h4 className="text-orange-500 font-bold mb-2">Player 3</h4>
                            <p className="text-white">Name: {reg.player3_name}</p>
                            <p className="text-white">Phone: {reg.player3_phone}</p>
                            <p className="text-white">School: {reg.player3_school}</p>
                          </div>
                          {reg.player4_name && (
                            <div>
                              <h4 className="text-orange-500 font-bold mb-2">Player 4</h4>
                              <p className="text-white">Name: {reg.player4_name}</p>
                              <p className="text-white">Phone: {reg.player4_phone}</p>
                              <p className="text-white">School: {reg.player4_school}</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                  {editingId === reg.id && (
                    <tr key={reg.id + "-edit"} className="bg-gray-800/50">
                      <td colSpan={4} className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-gray-400 text-xs">Team Name</label>
                            <input
                              value={editData.team_name}
                              onChange={(e) => setEditData({ ...editData, team_name: e.target.value })}
                              className="w-full bg-gray-700 text-white px-2 py-1 rounded mb-2"
                            />
                          </div>
                          <div>
                            <label className="text-gray-400 text-xs">Leader Name</label>
                            <input
                              value={editData.leader_name}
                              onChange={(e) => setEditData({ ...editData, leader_name: e.target.value })}
                              className="w-full bg-gray-700 text-white px-2 py-1 rounded mb-2"
                            />
                          </div>
                          <div>
                            <label className="text-gray-400 text-xs">Leader Phone</label>
                            <input
                              value={editData.leader_phone}
                              onChange={(e) => setEditData({ ...editData, leader_phone: e.target.value })}
                              className="w-full bg-gray-700 text-white px-2 py-1 rounded mb-2"
                            />
                          </div>
                          <div>
                            <label className="text-gray-400 text-xs">Leader School</label>
                            <input
                              value={editData.leader_school}
                              onChange={(e) => setEditData({ ...editData, leader_school: e.target.value })}
                              className="w-full bg-gray-700 text-white px-2 py-1 rounded mb-2"
                            />
                          </div>
                          <div>
                            <label className="text-gray-400 text-xs">Player 2 Name</label>
                            <input
                              value={editData.player2_name}
                              onChange={(e) => setEditData({ ...editData, player2_name: e.target.value })}
                              className="w-full bg-gray-700 text-white px-2 py-1 rounded mb-2"
                            />
                          </div>
                          <div>
                            <label className="text-gray-400 text-xs">Player 2 Phone</label>
                            <input
                              value={editData.player2_phone}
                              onChange={(e) => setEditData({ ...editData, player2_phone: e.target.value })}
                              className="w-full bg-gray-700 text-white px-2 py-1 rounded mb-2"
                            />
                          </div>
                          <div>
                            <label className="text-gray-400 text-xs">Player 3 Name</label>
                            <input
                              value={editData.player3_name}
                              onChange={(e) => setEditData({ ...editData, player3_name: e.target.value })}
                              className="w-full bg-gray-700 text-white px-2 py-1 rounded mb-2"
                            />
                          </div>
                          <div>
                            <label className="text-gray-400 text-xs">Player 3 Phone</label>
                            <input
                              value={editData.player3_phone}
                              onChange={(e) => setEditData({ ...editData, player3_phone: e.target.value })}
                              className="w-full bg-gray-700 text-white px-2 py-1 rounded mb-2"
                            />
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button onClick={saveEdit} className="bg-green-600 text-white px-4 py-2 rounded text-sm">
                            Save
                          </button>
                          <button onClick={cancelEdit} className="bg-gray-600 text-white px-4 py-2 rounded text-sm">
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-gray-500 text-sm">Total: {registrations.length} teams</div>
      </div>
    </div>
  );
}

export default AdminPage;