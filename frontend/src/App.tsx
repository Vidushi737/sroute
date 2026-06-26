import { Outlet } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F0]">
      {/* Background radial glow blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#14B8A6]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />
      
      <main className="flex-1 flex flex-col relative z-10">
        <Outlet />
      </main>
    </div>
  )
}

export default App
