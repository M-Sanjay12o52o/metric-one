"use client"

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client'; // Import Socket type from socket.io-client
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import QuestionForm from '@/components/QuestionForm';

interface QuizQuestion {
    question: string;
    options: string[];
}

export default function Home() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [nameValue, setNameValue] = useState<string>("")
    const [room, setRoom] = useState<string>("")
    const [userList, setUserList] = useState<string[]>([]);
    const [toggle, setToggle] = useState<boolean>(true)

    const showUsers = (users: any) => {
        if (users) {
            console.log("Users from showUsers: ", users)
            const usernames = users.map((user: any) => user.name);
            setUserList(usernames);
        }
    }

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
        }
    }

    const handleStart = () => {
        setToggle(!toggle);
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
                    <Button className='w-28 mb-4' id='join' type='submit'>Join</Button>
                </form>
            ) : (
                null
            )}

            <Button className='w-28 mb-4' onClick={handleStart}>{
                toggle ? "Start" : "Stop"
            }</Button>

            {/* questions form */}
            <QuestionForm socket={socket} />

            <p id="user-list">
                <em>Users in the room:  </em>
                {userList.length > 0 ? userList.join(', ') : 'No users in the room'}
            </p>
        </div >
    );
}
