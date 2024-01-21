import { FC, useState } from 'react'
import { Socket } from 'socket.io-client';

interface QuestionFormProps {
    socket: Socket | null
}

const QuestionForm: FC<QuestionFormProps> = ({ socket }) => {
    const [question, setQuestion] = useState('');
    const [option1, setOption1] = useState('');
    const [option2, setOption2] = useState('');
    const [option3, setOption3] = useState('');
    const [option4, setOption4] = useState('');

    const handleSubmit = (e: any) => {
        e.preventDefault();

        console.log('Submitted Question:', question);
        console.log('Option 1:', option1);
        console.log('Option 2:', option2);
        console.log('Option 3:', option3);
        console.log('Option 4:', option4);

        if (socket) {
            socket.emit('postQuestion', {
                question,
                options: [option1, option2, option3, option4],
            });
        }
        // Reset form fields
        setQuestion('');
        setOption1('');
        setOption2('');
        setOption3('');
        setOption4('');
    };

    return <div>
        <form className='border-black border-2 p-4' onSubmit={handleSubmit}>
            <label className='block mb-2'>
                Question:
                <input
                    id='question'
                    type="text"
                    className='border border-gray-300 p-2 w-full mt-1'
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
            </label>

            <label className='block mb-2'>
                Option 1:
                <input
                    id='option1'
                    type="text"
                    className='border border-gray-300 p-2 w-full mt-1'
                    value={option1}
                    onChange={(e) => setOption1(e.target.value)}
                />
            </label>

            <label className='block mb-2'>
                Option 2:
                <input
                    id='option2'
                    type="text"
                    className='border border-gray-300 p-2 w-full mt-1'
                    value={option2}
                    onChange={(e) => setOption2(e.target.value)}
                />
            </label>

            <label className='block mb-2'>
                Option 3:
                <input
                    id='option3'
                    type="text"
                    className='border border-gray-300 p-2 w-full mt-1'
                    value={option3}
                    onChange={(e) => setOption3(e.target.value)}
                />
            </label>

            <label className='block mb-2'>
                Option 4:
                <input
                    id='option4'
                    type="text"
                    className='border border-gray-300 p-2 w-full mt-1'
                    value={option4}
                    onChange={(e) => setOption4(e.target.value)}
                />
            </label>

            <button
                type='submit'
                className='bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
            >
                Post
            </button>
        </form>
    </div>
}

export default QuestionForm