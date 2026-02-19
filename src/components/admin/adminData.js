export const statsSeed = [
  { label: 'Active users', value: '12,480', delta: '+6.2%', trend: 'up' },
  { label: 'Reported posts', value: '38', delta: '-12%', trend: 'down' },
  { label: 'New signups', value: '214', delta: '+9%', trend: 'up' },
  { label: 'Pending reviews', value: '17', delta: '+3', trend: 'up' },
];

export const reportsSeed = [
  { id: 'R-1024', user: 'Amina S.', reason: 'Spam', content: 'Marketplace listing', time: '2m ago', status: 'Open', owner: 'Unassigned' },
  { id: 'R-1023', user: 'J. Ortega', reason: 'Harassment', content: 'Comment thread', time: '12m ago', status: 'Open', owner: 'Unassigned' },
  { id: 'R-1022', user: 'Imran K.', reason: 'False information', content: 'Public post', time: '29m ago', status: 'Open', owner: 'Unassigned' },
  { id: 'R-1021', user: 'N. Patel', reason: 'Hate speech', content: 'Group post', time: '1h ago', status: 'Open', owner: 'Unassigned' },
];

export const usersSeed = [
  { id: 'U-884', name: 'Kaif Islam', role: 'Admin', status: 'Active', joined: 'Aug 12, 2025' },
  { id: 'U-883', name: 'Mariam L.', role: 'Moderator', status: 'Active', joined: 'Sep 03, 2025' },
  { id: 'U-882', name: 'Syed Zahoor', role: 'User', status: 'Flagged', joined: 'Nov 21, 2025' },
  { id: 'U-881', name: 'Jawad Khan', role: 'User', status: 'Active', joined: 'Dec 08, 2025' },
  { id: 'U-880', name: 'Moni Moni', role: 'User', status: 'Suspended', joined: 'Dec 10, 2025' },
];

export const auditSeed = [
  { id: 'A-221', actor: 'Admin - Kaif', action: 'Suspended user U-880', time: '5m ago' },
  { id: 'A-220', actor: 'Moderator - Mariam', action: 'Removed post R-1022', time: '18m ago' },
  { id: 'A-219', actor: 'Admin - Kaif', action: 'Updated policy: Harassment', time: '42m ago' },
  { id: 'A-218', actor: 'System', action: 'Auto-flagged 6 comments', time: '1h ago' },
];

export const securitySeed = [
  { id: 'S-91', item: 'Unusual login', detail: 'IP flagged - 3 attempts', severity: 'high' },
  { id: 'S-90', item: 'Password reset spikes', detail: '12 resets in 10m', severity: 'medium' },
  { id: 'S-89', item: 'API key rotation', detail: 'Completed', severity: 'low' },
];

export const flagsSeed = [
  { id: 'F-1', name: 'Stories v2', status: 'On', rollout: '100%' },
  { id: 'F-2', name: 'Marketplace chat', status: 'On', rollout: '50%' },
  { id: 'F-3', name: 'New reactions', status: 'Off', rollout: '0%' },
  { id: 'F-4', name: 'Live producer beta', status: 'On', rollout: '10%' },
];

export const announcementsSeed = [
  { id: 'N-1', title: 'Maintenance window', detail: 'Saturday 1:00 AM - 2:30 AM' },
  { id: 'N-2', title: 'Policy update', detail: 'Spam enforcement tightened' },
];

export const alertsSeed = [
  { id: 'AL-1', title: 'Cache pressure', severity: 'Medium', message: 'Cache hit rate dropped below 82%' },
];

export const policiesSeed = [
  { id: 'P-1', title: 'Harassment', category: 'Safety', summary: 'Zero tolerance on threats and abuse.' },
  { id: 'P-2', title: 'Spam', category: 'Integrity', summary: 'Remove deceptive or repetitive content.' },
];

export const paymentsSeed = [
  { id: 'P-1', label: 'Revenue today', value: '$1,240' },
  { id: 'P-2', label: 'Chargebacks', value: '2' },
  { id: 'P-3', label: 'Subscriptions', value: '412 active' },
  { id: 'P-4', label: 'Payouts pending', value: '$3,110' },
];

export const usageSeriesSeed = [
  { label: 'Mon', value: 52 },
  { label: 'Tue', value: 68 },
  { label: 'Wed', value: 61 },
  { label: 'Thu', value: 78 },
  { label: 'Fri', value: 84 },
  { label: 'Sat', value: 73 },
  { label: 'Sun', value: 59 },
];
