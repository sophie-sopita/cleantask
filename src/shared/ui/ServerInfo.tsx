// Este es un React Server Component (no necesita 'use client')
export default function ServerInfo() {
  // Simulamos datos que podrían venir de una base de datos o API
  const serverData = {
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform,
    uptime: Math.floor(process.uptime()),
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-blue-800 mb-4">
        🖥️ Server Component - Información del Servidor
      </h3>
      <div className="space-y-2 text-blue-700">
        <div className="flex justify-between">
          <span className="font-medium">Timestamp:</span>
          <span className="font-mono text-sm">{serverData.timestamp}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Node.js:</span>
          <span className="font-mono text-sm">{serverData.nodeVersion}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Plataforma:</span>
          <span className="font-mono text-sm">{serverData.platform}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Uptime:</span>
          <span className="font-mono text-sm">{serverData.uptime}s</span>
        </div>
      </div>
      <p className="text-blue-700 text-sm mt-4">
        <strong>Nota:</strong> Este componente se renderiza en el servidor. 
        Los datos se procesan antes de enviar el HTML al cliente, mejorando el SEO y rendimiento inicial.
      </p>
    </div>
  )
}