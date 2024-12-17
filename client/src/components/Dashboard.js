// MyBoardsPage.js
import Sidebar from './Sidebar';

export default function Dashboard() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold">My Boards</h1>
          </div>
        </header>

        <main className="p-6">
          {/* Add Board Button */}
          <div className="mb-4 flex justify-between items-center">
            <button className="bg-black text-white px-4 py-2 rounded">
              + Create Board
            </button>
          </div>

          {/* Table */}
          <table className="w-full bg-white border rounded">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Created on</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-3">Board 1</td>
                <td className="p-3">Done</td>
                <td className="p-3">Birthday</td>
                <td className="p-3">20 Jan, 2024</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">Board 2</td>
                <td className="p-3">Editing</td>
                <td className="p-3">Vacation</td>
                <td className="p-3">12 July, 2024</td>
              </tr>
              <tr className="border-t">
                <td className="p-3">Board 3</td>
                <td className="p-3">Done</td>
                <td className="p-3">Year Recap</td>
                <td className="p-3">22 Feb, 2024</td>
              </tr>
              {/* Add more rows here */}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mt-4 flex justify-center space-x-2">
            <button className="px-3 py-1 bg-gray-300 rounded">1</button>
            <button className="px-3 py-1 bg-black text-white rounded">2</button>
            <button className="px-3 py-1 bg-gray-300 rounded">3</button>
            <button className="px-3 py-1 bg-gray-300 rounded">4</button>
            <button className="px-3 py-1 bg-gray-300 rounded">5</button>
            <span>...</span>
          </div>
        </main>
      </div>
    </div>
  );
}
