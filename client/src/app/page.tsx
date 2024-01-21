import { buttonVariants } from '@/components/ui/button'
import { getAuthSession } from '@/lib/auth'
import { HomeIcon, PlusIcon } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function Home() {
  const session = await getAuthSession()

  return (
    <>
      {session ? <h1 className='font-bold text-3xl md:text-4xl'>Welcome, {session.user.name}</h1> : null}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6'>
        {/* subreddit info */}
        <div className='overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last'>
          <div className='bg-emerald-100 px-6 py-4'>
            <p className='font-semibold py-3 flex items-center gap-1.5'>
              <HomeIcon className='h-4 w-4' />
              Home
            </p>
          </div>
          <dl className='-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6'>
            <div className='flex justify-between gap-x-4 py-3'>
              <p className='text-zinc-500'>
                Your personal Metric frontpage. Come here to check in with your
                favorite services.
              </p>
            </div>

            <Link
              className={buttonVariants({
                className: 'w-36 mt-4 mb-6 mr-4',
              })}
              href={`quizz/create`}>
              <PlusIcon />
              New Quizz
            </Link>

            <Link
              className={buttonVariants({
                className: 'w-36 mt-4 mb-6',
              })}
              href={`quizz/join`}>
              <PlusIcon />
              Join Quizz
            </Link>
          </dl>
        </div>
      </div>
    </>
  )
}




