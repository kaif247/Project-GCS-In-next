import React, { useState } from 'react';
import styles from './StoryReply.module.css';

const StoryReply = ({ onSubmit, onFocus, onBlur, onChange }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!value.trim()) return;
    onSubmit?.(value.trim());
    setValue('');
  };

  return (
    <form className={styles.reply} onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onChange?.(e.target.value);
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Reply..."
        aria-label="Reply"
      />
    </form>
  );
};

export default React.memo(StoryReply);
