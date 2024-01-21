"use client"

import { FormEvent, KeyboardEvent, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client'; // Import Socket type from socket.io-client
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { staticGenerationAsyncStorage } from 'next/dist/client/components/static-generation-async-storage.external';

interface Message {
    name: string;
    text: string;
    time: string;
}

export default function Home() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [nameValue, setNameValue] = useState<string>("")
    const [room, setRoom] = useState<string>("")
    const [userList, setUserList] = useState<string[]>([]);
    const [toggle, setToggle] = useState<boolean>(true);
    const [question, setQuestion] = useState('');
    const [option1, setOption1] = useState('');
    const [option2, setOption2] = useState('');
    const [option3, setOption3] = useState('');
    const [option4, setOption4] = useState('');
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');

    const showUsers = (users: any) => {
        if (users) {
            console.log("Users from showUsers: ", users)
            const usernames = users.map((user: any) => user.name);
            setUserList(usernames);
        }
    }


    const handleAnswerSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedAnswer(e.target.value);
    };

    const submitAnswer = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Selected Answer:', selectedAnswer);

        // Send the selected answer to the server or perform other actions
        // For example, you can emit a socket event to notify the server about the selected answer
        if (socket) {
            socket.emit('submitAnswer', { answer: selectedAnswer });
        }
    };

    useEffect(() => {
        const socketInstance = io('http://localhost:3001');
        setSocket(socketInstance);

        console.log('Connecting to server');

        socketInstance.on('connect', () => {
            // socketInstance.emit("message", "Welcome to Chat App!");
            console.log('Connected from server');
        });

        socketInstance.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        socketInstance.on("userList", ({ users }) => {
            console.log("users from socket.on: ", users)
            showUsers(users);
        })

        socketInstance.on("broadcastQuestion", ({ question, options }) => {
            console.log("question and options", question, options)
            setQuestion(question);
            setOption1(options[0])
            setOption2(options[1])
            setOption3(options[2]);
            setOption4(options[3])
        })

        return () => {
            // Clean up the event handler on component unmount
            socketInstance.disconnect();
        };
    }, []);


    const enterRoom = (e: any) => {
        e.preventDefault();

        if (nameValue && room) {
            socket?.emit("enterRoom", {
                "name": nameValue,
                "room": room,
            })

            setToggle(false);
        }

    }

    return (
        <div>
            {toggle ? (
                <form className="join" onSubmit={enterRoom}>
                    <Input
                        value={nameValue}
                        onChange={(e) => setNameValue(e.target.value)}
                        type="text"
                        id='name'
                        maxLength={12}
                        placeholder='Your name'
                        size={5}
                        required
                    />
                    <Input
                        value={room}
                        onChange={(e) => setRoom(e.target.value)}
                        type="text"
                        id='room'
                        placeholder='Chat room'
                        size={5}
                        required
                    />
                    <Button id='join' type='submit'>Join</Button>
                </form>
            ) : (
                null
            )}


            {question ? (
                <form onSubmit={submitAnswer} className="max-w-md mx-auto p-4 border rounded-md shadow-lg">
                    {/* Displaying questions */}
                    <h1 className="text-2xl font-bold mb-4">{question}</h1>

                    <div className="mb-4">
                        <label className="block mb-2">
                            <input
                                type="radio"
                                name="answer"
                                value={option1}
                                checked={selectedAnswer === option1}
                                onChange={handleAnswerSelection}
                                className="mr-2"
                            />
                            {option1}
                        </label>

                        <label className="block mb-2">
                            <input
                                type="radio"
                                name="answer"
                                value={option2}
                                checked={selectedAnswer === option2}
                                onChange={handleAnswerSelection}
                                className="mr-2"
                            />
                            {option2}
                        </label>

                        <label className="block mb-2">
                            <input
                                type="radio"
                                name="answer"
                                value={option3}
                                checked={selectedAnswer === option3}
                                onChange={handleAnswerSelection}
                                className="mr-2"
                            />
                            {option3}
                        </label>

                        <label className="block mb-2">
                            <input
                                type="radio"
                                name="answer"
                                value={option4}
                                checked={selectedAnswer === option4}
                                onChange={handleAnswerSelection}
                                className="mr-2"
                            />
                            {option4}
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    >
                        Submit Answer
                    </button>
                </form>
            ) : (
                null
            )}

            <p id="user-list">
                <em>Users in the room:  </em>
                {userList.length > 0 ? userList.join(', ') : 'No users in the room'}
            </p>
        </div >
    );
}
