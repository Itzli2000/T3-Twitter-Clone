import { useSession } from 'next-auth/react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import Button from './Button';
import ProfileImage from './ProfileImage';

const updateTextAreaHeight = (textArea?: HTMLTextAreaElement) => {
    if (!textArea) return;
    textArea.style.height = '0';
    textArea.style.height = `${textArea.scrollHeight}px`;
};

const NewTweetForm = () => {
    const session = useSession();
    if (session.status !== "authenticated") return null;
    return <Form />;
}

const Form = () => {
    const session = useSession();
    const [inputValue, setInputValue] = useState('');
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
    const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
        updateTextAreaHeight(textArea);
        textAreaRef.current = textArea;
    }, []);

    useLayoutEffect(() => {
        if (textAreaRef.current) {
            updateTextAreaHeight(textAreaRef.current);
        }
    }, [inputValue]);

    if (session.status !== "authenticated") return null;

    return (
        <form className='flex flex-col gap-2 border-b px-4 py-2'>
            <div className='flex gap-4'>
                <ProfileImage src={session.data.user.image} />
                <textarea ref={inputRef} style={{ height: 0 }} onChange={(e) => setInputValue(e.target.value)} className='flex-grow resize-none overflow-hidden p-4 text-lg outline-none' placeholder="what's happening" />
            </div>
            <Button className='self-end'>Tweet</Button>
        </form>
    )
};

export default NewTweetForm