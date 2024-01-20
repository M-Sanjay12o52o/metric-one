"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import axios, { AxiosError } from "axios"
import { CreateQuizzPayload } from '@/lib/validators/quizz'
import { toast } from '@/hooks/use-toast'
import { useCustomToast } from '@/hooks/use-custom-toast'

interface pageProps {

}

const Page: FC<pageProps> = ({ }) => {
    const [input, setInput] = useState<string>("")
    const router = useRouter();
    const { loginToast } = useCustomToast();

    const { mutate: createQuizz, isPending: isLoading } = useMutation({
        mutationFn: async () => {
            const payload: CreateQuizzPayload = {
                name: input,
            }

            const { data } = await axios.post('/api/quizz', payload)
            return data as string
        },
        onError: (err) => {
            console.log('Error occurred:', err);
            if (err instanceof AxiosError) {
                if (err.response?.status === 409) {
                    return toast({
                        title: "Quizz session with same name already exists",
                        description: "Please choose a different quizz session name",
                        variant: "destructive"
                    })
                }

                if (err.response?.status === 422) {
                    console.log('422 Error detected');
                    return toast({
                        title: "Invalid quizz session name",
                        description: "Please choose a name between 3 and 21 characters",
                        variant: "destructive"
                    })
                }

                if (err.response?.status === 401) {
                    return loginToast();
                }
            }
        }
    })

    return <div className='container flex items-center h-full max-w-3xl mx-auto'>
        <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
            <div className="flex justify-between items-center">
                <h1 className='text-xl font-semibold'>Create a session</h1>
            </div>

            <hr className='bg-zinc-500 h-px' />

            <div className="">
                <p className="text-lg font-medium">Name</p>
                <p className='text-xs pb-2'>
                    Session names including capitalization cannot be changed.
                </p>
                <div className='relative'>
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className='pl-6'
                    />
                </div>
            </div>

            <div className='flex justify-end gap-4'>
                <Button
                    disabled={isLoading}
                    variant='subtle'
                    onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button
                    isLoading={isLoading}
                    disabled={input.length === 0}
                    onClick={() => createQuizz()}>
                    Create Session
                </Button>
            </div>
        </div>
    </div>
}

export default Page