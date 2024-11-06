import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='my-40 text-center text-3xl flex justify-center items-center gap-10'>
      <Link target="_blank" className='underline cursor-pointer' href={"https://www.linkedin.com/in/swapnil-soni17/"}>
        LinkedIn
      </Link>
      <Link target="_blank" className='cursor-pointer underline' href={"https://github.com/Swapnil-DevGeek"}>
        GitHub
      </Link>
    </div>
  )
}

export default page
