import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import { FC } from 'react'

interface PageProps {
    params: {
        slug: string;
    }
}

const page: FC<PageProps> = async ({ params }: PageProps) => {
    const { slug } = params
    const session = await getAuthSession();

    const quizz = await db.quizz.findFirst({
        where: { name: slug },
        include: {
            questions: {
                include: {
                    author: true,
                    quizz: true,
                },

                take: 1
            }
        }
    })

    if (!quizz) return notFound();

    return <>
        <h1 className='font-bold text-3xl md:text-4xl h-14'>
            Quizz Session Id - {quizz.name}
        </h1>
    </>
}

export default page