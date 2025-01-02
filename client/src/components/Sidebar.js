export default function Sidebar() {
    return (
      <div className="h-screen bg-gray-900 text-white w-64 flex flex-col">
        {/* App Title */}
        <div className="p-6 font-bold text-lg border-b border-gray-700">
          Memory Mosaic
        </div>
  
        {/* Navigation */}
        <nav className="flex-1 mt-6">
          <ul>
            <li className="p-4 hover:bg-gray-700">
              <a href="#" className="flex items-center">
                <span className="mr-3">➕</span> Create Board
              </a>
            </li>
            <li className="p-4 bg-gray-700">
              <a href="#" className="flex items-center font-semibold">
                <span className="mr-3">📋</span> My Boards
              </a>
            </li>
            <li className="p-4 hover:bg-gray-700">
              <a href="/login" className="flex items-center">
                <span className="mr-3">🚪</span> Logout
              </a>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
  