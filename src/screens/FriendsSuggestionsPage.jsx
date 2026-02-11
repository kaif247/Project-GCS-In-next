import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import SuggestionsSidebar from '../components/FriendsSuggestions/SuggestionsSidebar';
import ProfilePreview from '../components/FriendsSuggestions/ProfilePreview';
import styles from '../components/FriendsSuggestions/friendsSuggestions.module.css';

const suggestionsSeed = [
  {
    id: 1,
    name: 'Sheraz Khawaja',
    avatar: 'https://i.pravatar.cc/300?img=40',
    mutualFriends: 2,
    location: 'Muzaffarabad',
    isRequestSent: true,
    isOnline: true,
    friendsCount: 565,
    details: {
      birthday: '10 October 2007',
      location: 'Muzaffarabad, Pakistan',
      education: 'University of Azad Jammu & Kashmir',
    },
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop',
      
    ],
    posts: [
      {
        id: 'p1',
        text: 'A beautiful evening by the river with family and friends.',
        location: 'Neelum Valley',
        time: '1 January',
        images: [
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500&h=300&fit=crop',
          'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=500&h=300&fit=crop',
        ],
      },
      {
        id: 'p2',
        text: 'Short message from today’s seminar.',
        location: 'Muzaffarabad',
        time: '3 February',
        video: 'https://www.w3schools.com/html/mov_bbb.mp4',
      },
      {
        id: 'p3',
        text: 'Weekend walk through the old city.',
        location: 'Muzaffarabad',
        time: '5 February',
        images: [
          'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=300&fit=crop',
        ],
      },
      {
        id: 'p4',
        text: 'A quick clip from the workshop.',
        location: 'Islamabad',
        time: '7 February',
        video: 'https://www.w3schools.com/html/movie.mp4',
      },
      {
        id: 'p5',
        text: 'New books, new goals.',
        location: 'Muzaffarabad',
        time: '9 February',
        images: [
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=300&fit=crop',
          'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=500&h=300&fit=crop',
        ],
      },
      {
        id: 'p6',
        text: 'Campus moments.',
        location: 'UoAJK',
        time: '10 February',
        images: [
          'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=300&fit=crop',
        ],
      },
      {
        id: 'p7',
        text: 'Training session highlights.',
        location: 'Muzaffarabad',
        time: '11 February',
        images: [
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500&h=300&fit=crop',
        ],
      },
      {
        id: 'p8',
        text: 'Working on a new project.',
        location: 'Muzaffarabad',
        time: '12 February',
        images: [
          'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
        ],
      },
      {
        id: 'p9',
        text: 'Community meetup recap.',
        location: 'Islamabad',
        time: '13 February',
        images: [
          'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Aqib Ali',
    avatar: 'https://i.pravatar.cc/300?img=33',
    mutualFriends: 33,
    location: 'Islamabad',
    isRequestSent: false,
    isOnline: false,
    friendsCount: 420,
    details: {
      birthday: '16 March 2002',
      location: 'Islamabad, Pakistan',
      education: 'NUST',
    },
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    ],
    posts: [
      {
        id: 'p2',
        text: 'Weekend hike with the squad.',
        location: 'Margalla Hills',
        time: '3h',
        images: ['https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=300&fit=crop'],
      },
    ],
  },
  {
    id: 3,
    name: 'Aakash Rathore',
    avatar: 'https://i.pravatar.cc/300?img=45',
    mutualFriends: 7,
    location: 'Muzaffarabad',
    isRequestSent: false,
    isOnline: true,
    friendsCount: 311,
    details: {
      birthday: '2 June 2001',
      location: 'Muzaffarabad, Pakistan',
      education: 'UOS',
    },
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop',
    ],
    posts: [
      {
        id: 'p3',
        text: 'New camera, new perspectives.',
        location: 'Muzaffarabad',
        time: 'Yesterday',
        images: ['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500&h=300&fit=crop'],
      },
    ],
  },
  {
    id: 4,
    name: 'Tahìr Rathore',
    avatar: 'https://i.pravatar.cc/300?img=48',
    mutualFriends: 69,
    location: 'Haripur',
    isRequestSent: false,
    isOnline: false,
    friendsCount: 701,
    details: {
      birthday: '12 April 1999',
      location: 'Haripur, Pakistan',
      education: 'UET Taxila',
    },
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&h=400&fit=crop',
    ],
    posts: [
      {
        id: 'p4',
        text: 'Good food, good mood.',
        location: 'Haripur',
        time: '2d',
        images: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=300&fit=crop'],
      },
    ],
  },
];

const FriendsSuggestionsPage = () => {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(suggestionsSeed[0]?.id);
  const [suggestions, setSuggestions] = useState(suggestionsSeed);

  const selectedProfile = useMemo(
    () => suggestions.find((item) => item.id === selectedId) || suggestions[0],
    [selectedId, suggestions]
  );

  const handleRemove = (id) => {
    setSuggestions((prev) => prev.filter((item) => item.id !== id));
    if (selectedId === id && suggestions.length > 1) {
      const next = suggestions.find((item) => item.id !== id);
      setSelectedId(next?.id);
    }
  };

  const handleToggleRequest = (id) => {
    setSuggestions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isRequestSent: !item.isRequestSent } : item
      )
    );
  };

  const handleMessage = (profile) => {
    if (!profile) return;
    const name = encodeURIComponent(profile.name);
    const avatar = encodeURIComponent(profile.avatar);
    router.push(`/chats?name=${name}&avatar=${avatar}`);
  };

  return (
    <div className={styles['friends-page-container']}>
      <SuggestionsSidebar
        suggestions={suggestions}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onRemove={handleRemove}
        onToggleRequest={handleToggleRequest}
      />
      {selectedProfile && (
        <ProfilePreview
          profile={selectedProfile}
          onToggleRequest={() => handleToggleRequest(selectedProfile.id)}
          onMessage={handleMessage}
        />
      )}
    </div>
  );
};

export default FriendsSuggestionsPage;
