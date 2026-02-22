import { useEffect, useState } from 'react';
import { blockUser, unblockUser } from '../utils/blockingApi';
import { addBlockedUser, loadBlockedUsers, removeBlockedUser, saveBlockedUsers } from '../utils/blockedStore';

const useBlockedUsers = () => {
  const [blockedUsers, setBlockedUsers] = useState([]);

  useEffect(() => {
    const sync = () => setBlockedUsers(loadBlockedUsers());
    sync();
    window.addEventListener('gcs-blocking-updated', sync);
    return () => window.removeEventListener('gcs-blocking-updated', sync);
  }, []);

  const addBlocked = (user) => {
    const next = addBlockedUser(user);
    setBlockedUsers(next);
  };

  const removeBlocked = (userId) => {
    const next = removeBlockedUser(userId);
    setBlockedUsers(next);
  };

  const block = async (user) => {
    await blockUser(user.id);
    addBlocked(user);
  };

  const unblock = async (userId) => {
    await unblockUser(userId);
    removeBlocked(userId);
  };

  return {
    blockedUsers,
    block,
    unblock,
    addBlocked,
    removeBlocked,
  };
};

export default useBlockedUsers;
