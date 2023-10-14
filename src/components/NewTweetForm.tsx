import { useSession } from 'next-auth/react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import Button from './Button';
import ProfileImage from './ProfileImage';
import { api } from '~/utils/api';

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

    const createTweet = api.tweet.create.useMutation({
        onSuccess: (newTweet) => {
            setInputValue('');
        },
    });

    if (session.status !== "authenticated") return null;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createTweet.mutate({ content: inputValue });
    };

    return (
        <form className='flex flex-col gap-2 border-b px-4 py-2' onSubmit={handleSubmit}>
            <div className='flex gap-4'>
                <ProfileImage src={session.data.user.image} />
                <textarea ref={inputRef} style={{ height: 0 }} onChange={(e) => setInputValue(e.target.value)} className='flex-grow resize-none overflow-hidden p-4 text-lg outline-none' placeholder="what's happening" />
            </div>
            <Button className='self-end'>Tweet</Button>
        </form>
    )
};

export default NewTweetForm