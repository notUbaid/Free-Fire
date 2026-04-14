"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  created_at: string;
}

function AdminPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [authenticated, setAuthenticated] = useState(false);

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
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">📊 Admin Panel</h1>
          <button
            onClick={() => window.location.reload()}
            className="text-orange-500 text-sm hover:underline"
          >
            Refresh
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-700">
                <tr>
                  <th className="text-left p-3 text-gray-400 font-medium">Team</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Leader</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Email</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Phone</th>
                  <th className="text-left p-3 text-gray-400 font-medium">School</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Players</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.id} className="border-t border-gray-700">
                    <td className="p-3 text-orange-500 font-bold">{reg.team_name}</td>
                    <td className="p-3 text-white">{reg.leader_name}</td>
                    <td className="p-3 text-gray-300">{reg.leader_email}</td>
                    <td className="p-3 text-gray-300">{reg.leader_phone}</td>
                    <td className="p-3 text-gray-300">{reg.leader_school}</td>
                    <td className="p-3 text-gray-300">
                      <div className="space-y-1">
                        <div>P2: {reg.player2_name}</div>
                        <div>P3: {reg.player3_name}</div>
                        {reg.player4_name && <div>P4: {reg.player4_name}</div>}
                      </div>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => deleteRegistration(reg.id)}
                        className="text-red-500 hover:text-red-400 text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-gray-500 text-sm">
          Total: {registrations.length} teams
        </div>
      </div>
    </div>
  );
}

export default AdminPage;