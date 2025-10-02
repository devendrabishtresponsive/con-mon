/* app/users/page.tsx */
'use client';

import { useEffect, useState } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState({ name: '', email: '', password: '' });

  const fetchUsers = async () => {
    // const res = await fetch('/api/users-del'); // old endpoint
    const res = await fetch('/api/database/users');
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async () => {
    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    setNewUser({ name: '', email: '', password: '' });
    fetchUsers();
  };

  const handleUpdate = async () => {
    await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: editingUserId, ...editingUser }),
    });
    setEditingUserId(null);
    setEditingUser({ name: '', email: '', password: '' });
    fetchUsers();
  };

  const handleDelete = async (id: string) => {
    await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _id: id }),
    });
    fetchUsers();
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Users Management</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add New User</h2>
        <input className="border p-1 mr-2" placeholder="Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
        <input className="border p-1 mr-2" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
        <input className="border p-1 mr-2" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
        <button className="bg-blue-500 text-white px-3 py-1" onClick={handleCreate}>Create</button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">All Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user._id} className="border p-2 mb-2 flex justify-between items-center">
              {editingUserId === user._id ? (
                <>
                  <input className="border p-1 mr-2" value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} />
                  <input className="border p-1 mr-2" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} />
                  <input className="border p-1 mr-2" value={editingUser.password} onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })} />
                  <button className="bg-green-500 text-white px-2 py-1 mr-1" onClick={handleUpdate}>Save</button>
                  <button className="bg-gray-300 px-2 py-1" onClick={() => setEditingUserId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <span><strong>{user.name}</strong> ({user.email})</span>
                  <div>
                    <button className="bg-yellow-400 px-2 py-1 mr-2" onClick={() => {
                      setEditingUserId(user._id);
                      setEditingUser({ name: user.name, email: user.email, password: user.password });
                    }}>Edit</button>
                    <button className="bg-red-500 text-white px-2 py-1" onClick={() => handleDelete(user._id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}


// // app/users/page.tsx
// 'use client';

// import { useEffect, useState } from 'react';

// type User = {
//     _id: string;
//     name: string;
//     email: string;
//     picture: string;
// };

// export default function UsersPage() {
//     const [users, setUsers] = useState<User[]>([]);
    
//     useEffect(() => {
//         fetch('/api/users')
//         .then(res => res.json())
//         .then(data => setUsers(data));
//     }, []);
    
//     return (
//         <main className="p-4">
//         <h1 className="text-2xl font-bold mb-4">All Users</h1>
//         {users.length === 0 && <p>No users found.</p>}
//         <ul className="space-y-2">
//         {users.map((user) => (
//             <li key={user._id} className="border p-2 rounded">
//                 <p><strong>_id: </strong>{user._id}</p>
//                 <p><strong>name: </strong>{user.name}</p>
//                 <p><strong>email: </strong>{user.email}</p>
//                 <p><strong>password: </strong>{user.password}</p>
//             </li>
//         ))}
//         </ul>
//         </main>
//     );
// }