"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";

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

  const fetchScores = async () => {
    const res = await fetch("/api/admin-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      const data = await res.json();
      setRegistrations(data.registrations);
    }
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
    const res = await fetch("/api/admin-approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password, approved: true }),
    });
    if (res.ok) {
      setRegistrations(registrations.map(r => r.id === id ? { ...r, approved: true } : r));
    }
  };

  const unapproveTeam = async (id: string) => {
    if (!confirm("Remove from scoreboard? This will hide them from /scoremanager and /score")) return;
    const res = await fetch("/api/admin-approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password, approved: false }),
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

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setTextColor(255, 106, 0);
    doc.text("Free Fire MAX Tournament - Registrations", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Total Teams: ${registrations.length} | Date: ${new Date().toLocaleDateString()}`, 105, 28, { align: "center" });
    
    let y = 40;
    
    registrations.forEach((reg, i) => {
      const linesNeeded = reg.player4_name ? 55 : 50;
      
      if (y + linesNeeded > 280) {
        doc.addPage();
        y = 20;
      }
      
      doc.setFontSize(12);
      doc.setTextColor(255, 106, 0);
      doc.text(`${i + 1}. ${reg.team_name}`, 14, y);
      
      doc.setFontSize(10);
      doc.setTextColor(reg.approved ? 0 : 200, reg.approved ? 150 : 100, 0);
      doc.text(`Status: ${reg.approved ? "Approved" : "Pending"}`, 14, y + 6);
      
      doc.setTextColor(0);
      doc.text(`Leader: ${reg.leader_name}`, 14, y + 12);
      doc.text(`Phone: ${reg.leader_phone}`, 14, y + 18);
      doc.text(`Email: ${reg.leader_email}`, 14, y + 24);
      doc.text(`School: ${reg.leader_school}`, 14, y + 30);
      
      y += 38;
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text(`Player 2: ${reg.player2_name} (${reg.player2_phone}) - ${reg.player2_school}`, 14, y);
      y += 5;
      doc.text(`Player 3: ${reg.player3_name} (${reg.player3_phone}) - ${reg.player3_school}`, 14, y);
      if (reg.player4_name) {
        y += 5;
        doc.text(`Player 4: ${reg.player4_name} (${reg.player4_phone}) - ${reg.player4_school}`, 14, y);
      }
      
      y += 10;
    });
    
    doc.save(`registrations-${new Date().toISOString().split('T')[0]}.pdf`);
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
          <div className="flex gap-3">
            <button onClick={downloadPDF} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg">
              Download
            </button>
            <button onClick={() => window.location.reload()} className="text-orange-500 text-sm hover:underline">
              Refresh
            </button>
          </div>
        </div>

        {/* Quick Add Team */}
        <div className="bg-gray-800 rounded-xl p-4 mb-6">
          <h2 className="text-white font-bold mb-3">Quick Add Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input id="add-team-name" placeholder="Team Name" className="bg-gray-700 text-white px-3 py-2 rounded text-sm" />
            <input id="add-leader-name" placeholder="Leader Name" className="bg-gray-700 text-white px-3 py-2 rounded text-sm" />
            <input id="add-leader-email" placeholder="Leader Email" className="bg-gray-700 text-white px-3 py-2 rounded text-sm" />
            <input id="add-leader-phone" placeholder="Leader Phone" className="bg-gray-700 text-white px-3 py-2 rounded text-sm" />
            <input id="add-leader-school" placeholder="Leader School" className="bg-gray-700 text-white px-3 py-2 rounded text-sm" />
            <input id="add-p2-name" placeholder="Player 2 Name" className="bg-gray-700 text-white px-3 py-2 rounded text-sm" />
            <input id="add-p2-phone" placeholder="Player 2 Phone" className="bg-gray-700 text-white px-3 py-2 rounded text-sm" />
            <input id="add-p2-school" placeholder="Player 2 School" className="bg-gray-700 text-white px-3 py-2 rounded text-sm" />
            <input id="add-p3-name" placeholder="Player 3 Name" className="bg-gray-700 text-white px-3 py-2 rounded text-sm" />
            <input id="add-p3-phone" placeholder="Player 3 Phone" className="bg-gray-700 text-white px-3 py-2 rounded text-sm" />
            <input id="add-p3-school" placeholder="Player 3 School" className="bg-gray-700 text-white px-3 py-2 rounded text-sm" />
            <input id="add-p4-name" placeholder="Player 4 Name (optional)" className="bg-gray-700 text-white px-3 py-2 rounded text-sm" />
            <input id="add-p4-phone" placeholder="Player 4 Phone" className="bg-gray-700 text-white px-3 py-2 rounded text-sm" />
            <input id="add-p4-school" placeholder="Player 4 School" className="bg-gray-700 text-white px-3 py-2 rounded text-sm" />
            <button 
              onClick={async () => {
                const data = {
                  team_name: (document.getElementById('add-team-name') as HTMLInputElement).value,
                  leader_name: (document.getElementById('add-leader-name') as HTMLInputElement).value,
                  leader_email: (document.getElementById('add-leader-email') as HTMLInputElement).value,
                  leader_phone: (document.getElementById('add-leader-phone') as HTMLInputElement).value,
                  leader_school: (document.getElementById('add-leader-school') as HTMLInputElement).value,
                  player2_name: (document.getElementById('add-p2-name') as HTMLInputElement).value,
                  player2_phone: (document.getElementById('add-p2-phone') as HTMLInputElement).value,
                  player2_school: (document.getElementById('add-p2-school') as HTMLInputElement).value,
                  player3_name: (document.getElementById('add-p3-name') as HTMLInputElement).value,
                  player3_phone: (document.getElementById('add-p3-phone') as HTMLInputElement).value,
                  player3_school: (document.getElementById('add-p3-school') as HTMLInputElement).value,
                  player4_name: (document.getElementById('add-p4-name') as HTMLInputElement).value,
                  player4_phone: (document.getElementById('add-p4-phone') as HTMLInputElement).value,
                  player4_school: (document.getElementById('add-p4-school') as HTMLInputElement).value,
                };
                const res = await fetch('/api/add-registration', {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({password, ...data})
                });
                if (res.ok) { alert('Team added!'); window.location.reload(); }
                else { const err = await res.json(); alert(err.error || 'Failed'); }
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-bold"
            >
              Add Team
            </button>
          </div>
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