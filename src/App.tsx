import './App.css'

interface ServerInfo {
  name: string;
  region: string;
  activeUsers: number;
  isOnline: boolean;
}

interface DeveloperProfile {
  fullName: string;
  role: string;
  semester: number;
  completedProjects: number;
  isAvailableForHere: boolean;
}

const mainServer: ServerInfo = {
  name: "Alpha-Node-01",
  region: "Singapore",
  activeUsers: 128,
  isOnline: true,
};

const profile: DeveloperProfile = {
  fullName: "RafaelPransa",
  role: "Software Developer",
  semester: 7,
  completedProjects: 1,
  isAvailableForHire: true,
};

function App() {

  return (
    <main>
      <h1>Dashboard Monitoring Server</h1>
      <div className="server-card">
        <h2>Nama Server: {mainServer.name}</h2>
        <p>Lokasi: {mainServer.region}</p>
        <p>Pengguna Aktif: {mainServer.activeUsers} user</p>
        <p>Status: {mainServer.isOnline ? "🟢 Online" : "🔴 Offline"}</p>
      </div>

      <h2>Profile Developer</h2>
      <div className="profile-card">
        <h3>Nama: {profile.fullName}</h3>
        <p>Role: {profile.role}</p>
        <p>Semester: {profile.semester}</p>
        <p>Proyek Selesai: {profile.completedProjects}</p>
        <p>Status: {profile.isAvailableForHire ? "Siap menerima proyek" : "Sedang fokus kuliah"}</p>
        <p>Estimasi semester: {8 - profile.semester} lagi</p>
      </div>
    </main>
  )
}

export default App