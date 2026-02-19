export const resolveMessageGrouping = (messages) => {
  const result = new Map();
  if (!Array.isArray(messages)) return result;

  for (let i = 0; i < messages.length; i += 1) {
    const current = messages[i];
    const prev = messages[i - 1];
    const next = messages[i + 1];

    const prevSame =
      prev && prev.senderId === current.senderId && (current.timestamp - prev.timestamp) < 120000;
    const nextSame =
      next && next.senderId === current.senderId && (next.timestamp - current.timestamp) < 120000;

    let groupPosition = 'single';
    if (!prevSame && nextSame) groupPosition = 'first';
    if (prevSame && nextSame) groupPosition = 'middle';
    if (prevSame && !nextSame) groupPosition = 'last';

    const gapAbove = prevSame ? 4 : 12;
    const avatarVisible = !current.isSelf && groupPosition === 'last';
    const tailVisible = groupPosition === 'last';

    result.set(current.id, {
      groupPosition,
      gapAbove,
      avatarVisible,
      tailVisible,
    });
  }

  return result;
};
