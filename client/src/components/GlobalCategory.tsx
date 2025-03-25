import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, UserPlus, Check, X } from 'lucide-react';

interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  lastSeen: string;
}

const GlobalCategory: React.FC = () => {
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'John Doe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        status: 'online',
        lastSeen: 'Just now'
      },
      {
        id: '2',
        name: 'Jane Smith',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
        status: 'online',
        lastSeen: '2 minutes ago'
      },
      // Add more mock users as needed
    ];
    setOnlineUsers(mockUsers);
  }, []);

  const handleSendFriendRequest = (userId: string) => {
    // Implement friend request logic
    console.log('Sending friend request to:', userId);
  };

  const handleAcceptFriendRequest = (userId: string) => {
    setFriendRequests(prev => prev.filter(user => user.id !== userId));
    // Implement accept friend request logic
  };

  const handleRejectFriendRequest = (userId: string) => {
    setFriendRequests(prev => prev.filter(user => user.id !== userId));
    // Implement reject friend request logic
  };

  const filteredUsers = onlineUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-primary">Global Community</h2>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-2">Online Users</h3>
        {filteredUsers.map(user => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
              </div>
              <div>
                <h4 className="font-medium">{user.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.lastSeen}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleSendFriendRequest(user.id)}
              className="p-2 text-primary hover:text-primary/80 focus:outline-none"
            >
              <UserPlus className="w-5 h-5" />
            </button>
          </motion.div>
        ))}
      </div>

      {friendRequests.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Friend Requests</h3>
          {friendRequests.map(user => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mb-2"
            >
              <div className="flex items-center gap-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-medium">{user.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Wants to be your friend
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAcceptFriendRequest(user.id)}
                  className="p-2 text-green-500 hover:text-green-600 focus:outline-none"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleRejectFriendRequest(user.id)}
                  className="p-2 text-red-500 hover:text-red-600 focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GlobalCategory; 