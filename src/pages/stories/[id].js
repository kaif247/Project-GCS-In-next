import React from 'react';
import { useRouter } from 'next/router';
import StoryViewer from '../../components/StoryViewer/StoryViewer';

const StoryViewerPage = () => {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return null;
  return <StoryViewer initialStoryId={id} />;
};

export default StoryViewerPage;
