'use client';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const ChatRoom = () => {
  const params = useParams();
  const roomId = params.roomId as string;

  const [copyStatus, setCopyStatus] = useState('COPY');
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  const copyLink = () => {
    const url = `${window.location.href}`;
    navigator.clipboard.writeText(url);
    setCopyStatus('COPIED!');
    setTimeout(() => {
      setCopyStatus('COPY');
    }, 2000);
  };
  return (
    <main className='flex flex-col h-screen max-h-screen overflow-hidden'>
      <header className='border-b border-zinc-800 p-4 flex items-center justify-between bg-zinc-900/30'>
        <div className='flex items-center gap-4'>
          <div className='flex flex-col'>
            <span className=' uppercase text-zinc-500 text-xs'>Room ID</span>
            <div className='flex items-center gap-2'>
              <span className='font-bold text-green-500'>{roomId}</span>
              <button
                className='text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-0.5 rounded text-zinc-400 hover:text-zinc-200 transition-colors'
                onClick={copyLink}
              >
                {copyStatus}
              </button>
            </div>
          </div>
          <div className='h-8 w-px bg-zinc-800' />
          <div className='flex flex-col'>
            <span className=' uppercase text-zinc-500 text-xs'>
              Self-Destruct
            </span>
            <span
              className={`text-sm font-bold flex items-center gap-2 ${timeRemaining !== null && timeRemaining < 60 ? 'text-red-500' : 'text-amber-500'}`}
            >
              {timeRemaining !== null ? `${timeRemaining}s` : '--:--'}
            </span>
          </div>
        </div>
      </header>
    </main>
  );
};

export default ChatRoom;
