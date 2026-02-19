const buildProfilePreview = (user) => {
  const name = user?.name || user?.username || 'User';
  const avatar =
    user?.avatar ||
    user?.avatarUrl ||
    user?.photo ||
    'https://i.pravatar.cc/300?img=11';
  return {
    id: user?.id || name,
    name,
    avatar,
    cover: user?.cover || avatar,
    friendsCount: user?.friendsCount ?? 0,
    mutualFriends: user?.mutualFriends ?? 0,
    details: user?.details || {
      birthday: 'Birthday not set',
      location: 'Location not set',
      education: 'Education not set',
    },
    photos: user?.photos || [avatar],
    posts: user?.posts || [],
    isRequestSent: user?.isRequestSent ?? false,
  };
};

export default buildProfilePreview;
