import React, { useEffect, useRef, useState, useContext } from 'react';
import MessageList from './MessageList';
import { LanguageContext } from '../../context/LanguageContext';

const ChatsMain = ({ chat, onSend, onBack, showBack }) => {
  const [message, setMessage] = useState('');
  const [isAttachOpen, setIsAttachOpen] = useState(false);
  const [pendingAttachment, setPendingAttachment] = useState(null);
  const [caption, setCaption] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageZoom, setImageZoom] = useState(1);
  const [isImageMenuOpen, setIsImageMenuOpen] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const threadRef = useRef(null);
  const attachMenuRef = useRef(null);
  const emojiMenuRef = useRef(null);
  const docInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const { t } = useContext(LanguageContext);

  const emojiList = [
    'ðŸ˜€','ðŸ˜ƒ','ðŸ˜„','ðŸ˜','ðŸ˜†','ðŸ˜…','ðŸ¤£','ðŸ˜‚','ðŸ™‚','ðŸ™ƒ','ðŸ˜‰','ðŸ˜Š','ðŸ˜‡','ðŸ¥°','ðŸ˜','ðŸ¤©','ðŸ˜˜','ðŸ˜—','ðŸ˜š','ðŸ˜™','ðŸ¥²','ðŸ˜‹','ðŸ˜›','ðŸ˜œ','ðŸ¤ª','ðŸ˜','ðŸ¤‘','ðŸ¤—','ðŸ¤­','ðŸ«¢','ðŸ«£','ðŸ¤«','ðŸ¤”',
    'ðŸ¤','ðŸ¤¨','ðŸ˜','ðŸ˜‘','ðŸ˜¶','ðŸ«¥','ðŸ˜¶â€ðŸŒ«ï¸','ðŸ˜','ðŸ˜’','ðŸ™„','ðŸ˜¬','ðŸ˜®â€ðŸ’¨','ðŸ¤¥','ðŸ˜Œ','ðŸ˜”','ðŸ˜ª','ðŸ¤¤','ðŸ˜´','ðŸ˜·','ðŸ¤’','ðŸ¤•','ðŸ¤¢','ðŸ¤®','ðŸ¤§','ðŸ¥µ','ðŸ¥¶','ðŸ¥´','ðŸ˜µ','ðŸ˜µâ€ðŸ’«','ðŸ¤¯','ðŸ¤ ','ðŸ¥³','ðŸ¥¸',
    'ðŸ˜Ž','ðŸ¤“','ðŸ§','ðŸ˜•','ðŸ«¤','ðŸ˜Ÿ','ðŸ™','â˜¹ï¸','ðŸ˜®','ðŸ˜¯','ðŸ˜²','ðŸ˜³','ðŸ¥º','ðŸ¥¹','ðŸ˜¦','ðŸ˜§','ðŸ˜¨','ðŸ˜°','ðŸ˜¥','ðŸ˜¢','ðŸ˜­','ðŸ˜±','ðŸ˜–','ðŸ˜£','ðŸ˜ž','ðŸ˜“','ðŸ˜©','ðŸ˜«','ðŸ¥±','ðŸ˜¤','ðŸ˜¡','ðŸ˜ ','ðŸ¤¬','ðŸ˜ˆ','ðŸ‘¿',
    'ðŸ’€','â˜ ï¸','ðŸ’©','ðŸ¤¡','ðŸ‘¹','ðŸ‘º','ðŸ‘»','ðŸ‘½','ðŸ‘¾','ðŸ¤–','ðŸ˜º','ðŸ˜¸','ðŸ˜¹','ðŸ˜»','ðŸ˜¼','ðŸ˜½','ðŸ™€','ðŸ˜¿','ðŸ˜¾','ðŸ™ˆ','ðŸ™‰','ðŸ™Š','ðŸ’‹','ðŸ’Œ','ðŸ’˜','ðŸ’','ðŸ’–','ðŸ’—','ðŸ’“','ðŸ’ž','ðŸ’•','ðŸ’Ÿ','â£ï¸','ðŸ’”','â¤ï¸','ðŸ§¡',
    'ðŸ’›','ðŸ’š','ðŸ’™','ðŸ’œ','ðŸ¤Ž','ðŸ–¤','ðŸ¤','ðŸ’¯','ðŸ’¢','ðŸ’¥','ðŸ’«','ðŸ’¦','ðŸ’¨','ðŸ•³ï¸','ðŸ’£','ðŸ’¬','ðŸ‘‹','ðŸ¤š','ðŸ–ï¸','âœ‹','ðŸ––','ðŸ‘Œ','ðŸ¤Œ','ðŸ¤','âœŒï¸','ðŸ¤ž','ðŸ¤Ÿ','ðŸ¤˜','ðŸ¤™','ðŸ‘ˆ','ðŸ‘‰','ðŸ‘†','ðŸ–•','ðŸ‘‡','â˜ï¸','ðŸ‘',
    'ðŸ‘Ž','âœŠ','ðŸ‘Š','ðŸ¤›','ðŸ¤œ','ðŸ‘','ðŸ™Œ','ðŸ«¶','ðŸ‘','ðŸ¤²','ðŸ¤','ðŸ™','âœï¸','ðŸ’…','ðŸ¤³','ðŸ’ª','ðŸ¦¾','ðŸ¦¿','ðŸ¦µ','ðŸ¦¶','ðŸ‘‚','ðŸ¦»','ðŸ‘ƒ','ðŸ§ ','ðŸ«€','ðŸ«','ðŸ¦·','ðŸ¦´','ðŸ‘€','ðŸ‘ï¸','ðŸ‘…','ðŸ‘„','ðŸ«¦','ðŸ‘¶','ðŸ§’','ðŸ‘¦','ðŸ‘§',
    'ðŸ§‘','ðŸ‘±','ðŸ‘¨','ðŸ‘©','ðŸ§”','ðŸ‘¨â€ðŸ¦°','ðŸ‘©â€ðŸ¦°','ðŸ‘¨â€ðŸ¦±','ðŸ‘©â€ðŸ¦±','ðŸ‘¨â€ðŸ¦³','ðŸ‘©â€ðŸ¦³','ðŸ‘¨â€ðŸ¦²','ðŸ‘©â€ðŸ¦²','ðŸ§“','ðŸ‘´','ðŸ‘µ','ðŸ™','ðŸ™Ž','ðŸ™…','ðŸ™†','ðŸ’','ðŸ™‹','ðŸ§','ðŸ™‡','ðŸ¤¦','ðŸ¤·','ðŸ‘®','ðŸ•µï¸','ðŸ’‚','ðŸ¥·','ðŸ‘·','ðŸ¤´','ðŸ‘¸',
    'ðŸ‘³','ðŸ‘²','ðŸ§•','ðŸ¤µ','ðŸ‘°','ðŸ¤°','ðŸ¤±','ðŸ‘¼','ðŸŽ…','ðŸ¤¶','ðŸ¦¸','ðŸ¦¹','ðŸ§™','ðŸ§š','ðŸ§›','ðŸ§œ','ðŸ§','ðŸ§ž','ðŸ§Ÿ','ðŸ§Œ','ðŸ’†','ðŸ’‡','ðŸš¶','ðŸƒ','ðŸ§','ðŸ§Ž','ðŸ§‘â€ðŸ¦¯','ðŸ‘¨â€ðŸ¦¯','ðŸ‘©â€ðŸ¦¯','ðŸ§‘â€ðŸ¦¼','ðŸ‘¨â€ðŸ¦¼','ðŸ‘©â€ðŸ¦¼','ðŸ§‘â€ðŸ¦½',
    'ðŸ‘¨â€ðŸ¦½','ðŸ‘©â€ðŸ¦½','ðŸ§‘â€ðŸ¤â€ðŸ§‘','ðŸ‘­','ðŸ‘«','ðŸ‘¬','ðŸ’‘','ðŸ‘©â€â¤ï¸â€ðŸ‘©','ðŸ‘¨â€â¤ï¸â€ðŸ‘¨','ðŸ’','ðŸ‘©â€â¤ï¸â€ðŸ’‹â€ðŸ‘©','ðŸ‘¨â€â¤ï¸â€ðŸ’‹â€ðŸ‘¨','ðŸ‘ª','ðŸ‘¨â€ðŸ‘©â€ðŸ‘§','ðŸ‘¨â€ðŸ‘©â€ðŸ‘§â€ðŸ‘¦','ðŸ‘¨â€ðŸ‘©â€ðŸ‘¦â€ðŸ‘¦','ðŸ‘¨â€ðŸ‘©â€ðŸ‘§â€ðŸ‘§','ðŸ‘©â€ðŸ‘©â€ðŸ‘¦','ðŸ‘©â€ðŸ‘©â€ðŸ‘§',
    'ðŸ‘©â€ðŸ‘©â€ðŸ‘§â€ðŸ‘¦','ðŸ‘©â€ðŸ‘©â€ðŸ‘¦â€ðŸ‘¦','ðŸ‘©â€ðŸ‘©â€ðŸ‘§â€ðŸ‘§','ðŸ‘¨â€ðŸ‘¨â€ðŸ‘¦','ðŸ‘¨â€ðŸ‘¨â€ðŸ‘§','ðŸ‘¨â€ðŸ‘¨â€ðŸ‘§â€ðŸ‘¦','ðŸ‘¨â€ðŸ‘¨â€ðŸ‘¦â€ðŸ‘¦','ðŸ‘¨â€ðŸ‘¨â€ðŸ‘§â€ðŸ‘§','ðŸ‘©â€ðŸ‘¦','ðŸ‘©â€ðŸ‘§','ðŸ‘©â€ðŸ‘§â€ðŸ‘¦','ðŸ‘©â€ðŸ‘¦â€ðŸ‘¦','ðŸ‘©â€ðŸ‘§â€ðŸ‘§','ðŸ‘¨â€ðŸ‘¦','ðŸ‘¨â€ðŸ‘§','ðŸ‘¨â€ðŸ‘§â€ðŸ‘¦','ðŸ‘¨â€ðŸ‘¦â€ðŸ‘¦',
    'ðŸ‘¨â€ðŸ‘§â€ðŸ‘§','ðŸ§³','ðŸŒ‚','â˜‚ï¸','ðŸ§µ','ðŸª¡','ðŸ§¶','ðŸ‘“','ðŸ•¶ï¸','ðŸ¥½','ðŸ¥¼','ðŸ¦º','ðŸ‘”','ðŸ‘•','ðŸ‘–','ðŸ§£','ðŸ§¤','ðŸ§¥','ðŸ§¦','ðŸ‘—','ðŸ‘˜','ðŸ¥»','ðŸ©±','ðŸ©²','ðŸ©³','ðŸ‘™','ðŸ‘š','ðŸ‘›','ðŸ‘œ','ðŸ‘','ðŸ›ï¸','ðŸŽ’','ðŸ‘ž','ðŸ‘Ÿ','ðŸ¥¾','ðŸ¥¿','ðŸ‘ ','ðŸ‘¡',
    'ðŸ©°','ðŸ‘¢','ðŸ‘‘','ðŸ‘’','ðŸŽ©','ðŸŽ“','ðŸ§¢','ðŸª–','ðŸ“¿','ðŸ’„','ðŸ’','ðŸ’Ž','ðŸ¶','ðŸ±','ðŸ­','ðŸ¹','ðŸ°','ðŸ¦Š','ðŸ»','ðŸ¼','ðŸ»â€â„ï¸','ðŸ¨','ðŸ¯','ðŸ¦','ðŸ®','ðŸ·','ðŸ¸','ðŸµ','ðŸ™Š','ðŸ”','ðŸ§','ðŸ¦','ðŸ¤','ðŸ£','ðŸº','ðŸ—','ðŸ´','ðŸ¦„','ðŸ¦“','ðŸ¦Œ',
    'ðŸ¦¬','ðŸ','ðŸ›','ðŸ¦‹','ðŸŒ','ðŸž','ðŸœ','ðŸª²','ðŸª³','ðŸ•·ï¸','ðŸ¦‚','ðŸ¢','ðŸ','ðŸ¦Ž','ðŸ™','ðŸ¦‘','ðŸ¦','ðŸ ','ðŸŸ','ðŸ¬','ðŸ¦ˆ','ðŸ³','ðŸ‹','ðŸŠ','ðŸ†','ðŸ…','ðŸ¦','ðŸ¦§','ðŸ˜','ðŸ¦','ðŸ¦›','ðŸª','ðŸ«','ðŸ¦’','ðŸ¦˜','ðŸ¦¥','ðŸ¦¦','ðŸ¦¨','ðŸ¦¡','ðŸ¦”',
    'ðŸ‡','ðŸ•Šï¸','ðŸ“','ðŸ¦ƒ','ðŸ¦¤','ðŸ¦š','ðŸ¦œ','ðŸ¦¢','ðŸ¦©','ðŸ¦','ðŸ¿ï¸','ðŸ¦«','ðŸ¦ƒ','ðŸ¦©','ðŸŒµ','ðŸŒ²','ðŸŒ³','ðŸŒ´','ðŸªµ','ðŸŒ±','ðŸŒ¿','â˜˜ï¸','ðŸ€','ðŸŽ','ðŸª´','ðŸŽ‹','ðŸƒ','ðŸ‚','ðŸ','ðŸ„','ðŸš','ðŸŒ¾','ðŸŒº','ðŸŒ»','ðŸŒ¹','ðŸ¥€','ðŸŒ·','ðŸŒ¼','ðŸª·','ðŸŒ¸','ðŸ’',
    'ðŸŒž','ðŸŒ','ðŸŒš','ðŸŒ›','ðŸŒœ','â­','ðŸŒŸ','âœ¨','âš¡','ðŸ”¥','ðŸ’§','ðŸŒˆ','â˜€ï¸','ðŸŒ¤ï¸','â›…','ðŸŒ¥ï¸','ðŸŒ¦ï¸','ðŸŒ§ï¸','â›ˆï¸','ðŸŒ©ï¸','ðŸŒ¨ï¸','â„ï¸','â˜ƒï¸','â›„','ðŸŒ¬ï¸','ðŸ’¨','ðŸŒªï¸','ðŸŒ«ï¸','ðŸŒŠ','ðŸ','ðŸŽ','ðŸ','ðŸŠ','ðŸ‹','ðŸŒ','ðŸ‰','ðŸ‡','ðŸ“','ðŸ«','ðŸˆ','ðŸ’',
    'ðŸ‘','ðŸ¥­','ðŸ','ðŸ¥¥','ðŸ¥','ðŸ…','ðŸ†','ðŸ¥‘','ðŸ¥¦','ðŸ¥¬','ðŸ¥’','ðŸŒ¶ï¸','ðŸ«‘','ðŸŒ½','ðŸ¥•','ðŸ«’','ðŸ§„','ðŸ§…','ðŸ¥”','ðŸ ','ðŸ¥','ðŸ¥¯','ðŸž','ðŸ¥–','ðŸ¥¨','ðŸ§€','ðŸ¥š','ðŸ³','ðŸ¥ž','ðŸ§‡','ðŸ¥“','ðŸ”','ðŸŸ','ðŸ•','ðŸŒ­','ðŸ¥ª','ðŸŒ®','ðŸŒ¯','ðŸ¥™','ðŸ§†','ðŸ¥—','ðŸ¥˜','ðŸ',
    'ðŸœ','ðŸ²','ðŸ›','ðŸ£','ðŸ±','ðŸ¥Ÿ','ðŸ¤','ðŸ™','ðŸš','ðŸ˜','ðŸ¥','ðŸ¥®','ðŸ¡','ðŸ¥ ','ðŸ¥¡','ðŸ¦€','ðŸ¦ž','ðŸ¦','ðŸ¦‘','ðŸ¦','ðŸ§','ðŸ¨','ðŸ©','ðŸª','ðŸŽ‚','ðŸ°','ðŸ§','ðŸ¥§','ðŸ«','ðŸ¬','ðŸ­','ðŸ®','ðŸ¯','ðŸ¼','ðŸ¥›','â˜•','ðŸµ','ðŸ§ƒ','ðŸ¥¤','ðŸ§‹','ðŸº','ðŸ»','ðŸ¥‚','ðŸ·',
    'ðŸ¥ƒ','ðŸ¸','ðŸ¹','ðŸ¾','ðŸ§Š','ðŸ¥„','ðŸ´','ðŸ¥£','ðŸ¥¡','ðŸ¥¢','âš½','ðŸ€','ðŸˆ','âš¾','ðŸŽ¾','ðŸ','ðŸ‰','ðŸŽ±','ðŸ“','ðŸ¸','ðŸ¥…','ðŸ’','ðŸ‘','ðŸ¥','ðŸ','ðŸªƒ','ðŸ¥Š','ðŸ¥‹','ðŸŽ½','ðŸ›¹','ðŸ›¼','ðŸ›·','â›¸ï¸','ðŸ¥Œ','ðŸŽ¿','â›·ï¸','ðŸ‚','ðŸª‚','ðŸ‹ï¸','ðŸ¤¼','ðŸ¤¸','â›¹ï¸','ðŸ¤º','ðŸ¤¾','ðŸŒï¸','ðŸ‡',
    'ðŸ§˜','ðŸ„','ðŸŠ','ðŸ¤½','ðŸš£','ðŸ§—','ðŸšµ','ðŸš´','ðŸ†','ðŸ¥‡','ðŸ¥ˆ','ðŸ¥‰','ðŸ…','ðŸŽ–ï¸','ðŸµï¸','ðŸŽ—ï¸','ðŸŽ«','ðŸŽŸï¸','ðŸŽª','ðŸ¤¹','ðŸŽ­','ðŸ©°','ðŸŽ¨','ðŸŽ¬','ðŸŽ¤','ðŸŽ§','ðŸŽ¼','ðŸŽ¹','ðŸ¥','ðŸª˜','ðŸŽ·','ðŸŽº','ðŸŽ¸','ðŸª•','ðŸŽ»','ðŸŽ²','â™Ÿï¸','ðŸŽ¯','ðŸŽ³','ðŸŽ®','ðŸŽ°','ðŸ§©',
  ];

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [chat]);

  const normalizeMessage = (text) => {
    if (!text) return '';
    let cleaned = text.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
    if (!cleaned) return '';
    if (!cleaned.includes(' ')) {
      cleaned = cleaned.replace(/\s+/g, '');
      return cleaned;
    }
    return cleaned.replace(/[ \t]+/g, ' ').replace(/\s*\n\s*/g, '\n');
  };

  useEffect(() => {
    if (!isAttachOpen) return undefined;
    const handleClickOutside = (event) => {
      if (attachMenuRef.current && !attachMenuRef.current.contains(event.target)) {
        setIsAttachOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isAttachOpen]);

  useEffect(() => {
    if (!isEmojiOpen) return undefined;
    const handleClickOutside = (event) => {
      if (emojiMenuRef.current && !emojiMenuRef.current.contains(event.target)) {
        setIsEmojiOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEmojiOpen]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (recordedAudio?.url) {
        URL.revokeObjectURL(recordedAudio.url);
      }
    };
  }, [recordedAudio]);

  if (!chat) {
    return (
      <section className="chats-main">
        <div className="chats-thread chats-thread--empty">
          {t('Select a chat to start messaging.')}
        </div>
      </section>
    );
  }

  const handleSend = () => {
    const trimmed = normalizeMessage(message);
    if (!trimmed) return;
    onSend(chat.id, { text: trimmed });
    setMessage('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handlePick = (type) => {
    if (type === 'doc') docInputRef.current?.click();
    if (type === 'image') imageInputRef.current?.click();
    if (type === 'video') videoInputRef.current?.click();
    if (type === 'audio') audioInputRef.current?.click();
  };

  const handleFileSelected = (event, kind) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPendingAttachment({
      kind,
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      mime: file.type,
    });
    setCaption('');
    event.target.value = '';
    setIsAttachOpen(false);
  };

  const handleCancelAttachment = () => {
    if (pendingAttachment?.url) URL.revokeObjectURL(pendingAttachment.url);
    setPendingAttachment(null);
    setCaption('');
  };

  const handleSendAttachment = () => {
    if (!pendingAttachment) return;
    onSend(chat.id, {
      attachment: {
        kind: pendingAttachment.kind,
        url: pendingAttachment.url,
        name: pendingAttachment.name,
        mime: pendingAttachment.mime,
      },
      text: normalizeMessage(caption) || undefined,
    });
    setPendingAttachment(null);
    setCaption('');
  };

  const startRecording = async () => {
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recordedChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedAudio({
          url,
          mime: blob.type,
          name: `voice-note-${Date.now()}.webm`,
        });
        recordedChunksRef.current = [];
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch {
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') return;
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const handleSendRecorded = () => {
    if (!recordedAudio) return;
    onSend(chat.id, {
      attachment: {
        kind: 'audio',
        url: recordedAudio.url,
        name: recordedAudio.name,
        mime: recordedAudio.mime,
      },
    });
    setRecordedAudio(null);
  };

  const handleCancelRecorded = () => {
    if (recordedAudio?.url) URL.revokeObjectURL(recordedAudio.url);
    setRecordedAudio(null);
  };

  const handleOpenImage = (msg) => {
    const isMine = msg.from === 'me';
    const previewUrl = msg.image || msg.attachment?.url;
    if (!previewUrl) return;
    setImagePreview({
      url: previewUrl,
      name: isMine ? t('You') : chat.name,
      avatar: isMine ? (chat.avatar || '') : chat.avatar,
      text: msg.text || '',
    });
    setImageZoom(1);
    setIsImageMenuOpen(false);
  };

  const handleCloseImage = () => {
    setImagePreview(null);
    setImageZoom(1);
    setIsImageMenuOpen(false);
  };

  const handleSaveImage = () => {
    if (!imagePreview?.url) return;
    const link = document.createElement('a');
    link.href = imagePreview.url;
    link.download = 'image';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setIsImageMenuOpen(false);
  };

  const handleEmojiPick = (emoji) => {
    setMessage((prev) => `${prev}${emoji}`);
  };


  return (
    <section className="chats-main">
      <div className="chats-main__card">
        <div className="chats-main__header">
          {showBack && (
            <button className="chats-back" type="button" onClick={onBack} aria-label={t('Back')}>
              &lt;-
            </button>
          )}
          <img src={chat.avatar} alt={chat.name} />
          <div>
            <div className="chats-main__title">{chat.name}</div>
            <div className="chats-main__meta">{t(chat.meta)} Â· {chat.online ? t('Online') : t('Last seen')}</div>
          </div>
          <div className="chats-main__actions">
            <button type="button" aria-label={t('Search messages')}>🔍</button>
            <button type="button" aria-label={t('Call')}>📞</button>
            <button type="button" aria-label={t('Video call')}>🎥</button>
            <button type="button" aria-label={t('Info')}>ℹ️</button>

          </div>
        </div>
      </div>

      <div className="chats-thread" ref={threadRef}>
        <MessageList
          messages={chat.messages.map((msg, idx) => ({
            ...msg,
            senderId: msg.from,
            isSelf: msg.from === 'me',
            senderName: msg.from === 'me' ? t('You') : chat.name,
            timestamp: msg.timestamp || Date.now() - (chat.messages.length - idx) * 60000,
            status: msg.status || 'delivered',
          }))}
          containerWidth={threadRef.current?.clientWidth || 600}
          highlightRanges={[]}
        />
        {message.trim().length > 0 && (
          <div className="chats-typing" aria-label={t('Typing')}>
            <span />
            <span />
            <span />
          </div>
        )}
                {isRecording && (
          <div className="chats-recording" aria-label={t('Recording')}>
            <span className="chats-recording__dot" />
            <span>{t('Recording voice note')}</span>
          </div>
        )}
      </div>

      <div className="chats-input">
        <div className="chats-input__left">
          <div className="chats-emoji" ref={emojiMenuRef}>
            <button
              className="chats-input__icon"
              aria-label={t('Emoji')}
              type="button"
              onClick={() => setIsEmojiOpen((prev) => !prev)}
            >
               🙂
            </button>
            {isEmojiOpen && (
              <div className="chats-emoji-picker" role="menu" aria-label={t('Emoji picker')}>
                {emojiList.map((emoji, index) => (
                  <button
                    key={`${emoji}-${index}`}
                    type="button"
                    className="chats-emoji-item"
                    onClick={() => handleEmojiPick(emoji)}
                    aria-label={emoji}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="chats-input__attach" ref={attachMenuRef}>
            <button
              className="chats-input__icon"
              aria-label={t('Attach')}
              type="button"
              onClick={() => setIsAttachOpen((prev) => !prev)}
            >
              <img src="/photo2.png" alt="" />
            </button>
            {isAttachOpen && (
              <div className="chats-attach-menu" role="menu" aria-label={t('Choose upload')}>
                <button type="button" className="chats-attach-item" onClick={() => handlePick('doc')}>
                  {t('Document')}
                </button>
                <button type="button" className="chats-attach-item" onClick={() => handlePick('image')}>
                  {t('Photo')}
                </button>
                <button type="button" className="chats-attach-item" onClick={() => handlePick('video')}>
                  {t('Video')}
                </button>
                <button type="button" className="chats-attach-item" onClick={() => handlePick('audio')}>
                  {t('Audio')}
                </button>
              </div>
            )}
            <input
              ref={docInputRef}
              type="file"
              className="chats-input__file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
              onChange={(event) => handleFileSelected(event, 'doc')}
            />
            <input
              ref={imageInputRef}
              type="file"
              className="chats-input__file"
              accept="image/*"
              onChange={(event) => handleFileSelected(event, 'image')}
            />
            <input
              ref={videoInputRef}
              type="file"
              className="chats-input__file"
              accept="video/*"
              onChange={(event) => handleFileSelected(event, 'video')}
            />
            <input
              ref={audioInputRef}
              type="file"
              className="chats-input__file"
              accept="audio/*"
              onChange={(event) => handleFileSelected(event, 'audio')}
            />
          </div>
          <button className="chats-input__icon" aria-label={t('Camera')} type="button">
            📷
          </button>
                    <button
            className="chats-input__icon"
            aria-label={isRecording ? t('Stop recording') : t('Record voice note')}
            type="button"
            onClick={() => {
              if (isRecording) {
                stopRecording();
              } else {
                startRecording();
              }
            }}
          >
            {isRecording ? 'STOP' : '🎙️'}
          </button>
        </div>
        <textarea
          rows={1}
          className="chats-input__textarea"
          placeholder={t('Type a message')}
          aria-label={t('Type a message')}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {message.trim().length > 0 && (
          <button className="chats-input__send" aria-label={t('Send')} onClick={handleSend}>
            &gt;
          </button>
        )}
      </div>

      {recordedAudio && (
        <div className="chats-attach-overlay" role="presentation">
          <div className="chats-attach-modal" role="dialog" aria-label={t('Send voice note')}>
            <div className="chats-attach-preview">
              <audio controls src={recordedAudio.url} />
            </div>
            <div className="chats-attach-actions">
              <button type="button" className="chats-attach-btn" onClick={handleCancelRecorded}>
                {t('Cancel')}
              </button>
              <button
                type="button"
                className="chats-attach-btn chats-attach-btn--primary"
                onClick={handleSendRecorded}
              >
                {t('Send')}
              </button>
            </div>
          </div>
        </div>
      )}

      {pendingAttachment && (
        <div className="chats-attach-overlay" role="presentation">
          <div className="chats-attach-modal" role="dialog" aria-label={t('Add description')}>
            <div className="chats-attach-preview">
              {pendingAttachment.kind === 'image' && (
                <img src={pendingAttachment.url} alt={pendingAttachment.name || t('Attachment')} />
              )}
              {pendingAttachment.kind === 'video' && (
                <video controls src={pendingAttachment.url} />
              )}
              {pendingAttachment.kind === 'audio' && (
                <audio controls src={pendingAttachment.url} />
              )}
              {pendingAttachment.kind === 'doc' && (
                <div className="chats-attach-doc">
                  <span className="chats-attach-doc__icon">DOC</span>
                  <span className="chats-attach-doc__name">{pendingAttachment.name}</span>
                </div>
              )}
            </div>
            <input
              type="text"
              className="chats-attach-caption"
              placeholder={t('Add a description')}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <div className="chats-attach-actions">
              <button type="button" className="chats-attach-btn" onClick={handleCancelAttachment}>
                {t('Cancel')}
              </button>
              <button
                type="button"
                className="chats-attach-btn chats-attach-btn--primary"
                onClick={handleSendAttachment}
              >
                {t('Send')}
              </button>
            </div>
          </div>
        </div>
      )}

      {imagePreview && (
        <div className="chats-image-overlay" role="presentation" onClick={handleCloseImage}>
          <div className="chats-image-modal" role="dialog" aria-label={t('Image preview')} onClick={(e) => e.stopPropagation()}>
            <div className="chats-image-header">
              {imagePreview.avatar && (
                <img src={imagePreview.avatar} alt={imagePreview.name} />
              )}
              <div className="chats-image-title">{imagePreview.name}</div>
              <div className="chats-image-actions">
                <button
                  type="button"
                  className="chats-image-zoom"
                  onClick={() => setImageZoom((z) => Math.min(3, z + 0.25))}
                  aria-label={t('Zoom in')}
                >
                  +
                </button>
                <button
                  type="button"
                  className="chats-image-zoom"
                  onClick={() => setImageZoom((z) => Math.max(1, z - 0.25))}
                  aria-label={t('Zoom out')}
                >
                  âˆ’
                </button>
                <div className="chats-image-menu">
                  <button
                    type="button"
                    className="chats-image-menu-btn"
                    onClick={() => setIsImageMenuOpen((prev) => !prev)}
                    aria-label={t('More options')}
                  >
                    â‹®
                  </button>
                  {isImageMenuOpen && (
                    <div className="chats-image-menu-dropdown" role="menu">
                      <button type="button" onClick={handleSaveImage}>
                        {t('Save image')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <button type="button" className="chats-image-close" onClick={handleCloseImage} aria-label={t('Close')}>
                Ã—
              </button>
            </div>
            <div className="chats-image-body">
              <img
                src={imagePreview.url}
                alt={imagePreview.text || t('Attachment')}
                style={{ transform: `scale(${imageZoom})` }}
              />
            </div>
            {imagePreview.text && (
              <div className="chats-image-caption">{t(imagePreview.text)}</div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ChatsMain;








