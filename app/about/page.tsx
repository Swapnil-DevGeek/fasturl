import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='my-40 text-center text-3xl'>
      Made with 💓 by <Link target="_blank" className='underline cursor-pointer' href={"https://www.linkedin.com/in/swapnil-soni17/"}>Swapnil Soni</Link>
    </div>
  )
}

export default page
