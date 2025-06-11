import React from 'react'

const TweetNotFound = () => {
  return (
    <div className='rounded-xl border text-card-foreground shadow min-w-80 p-0 overflow-hidden bg-[#15202b] max-h-fit'> 
      <p className='px-4 py-4 text-center font-medium text-lg'> 
    Sorry, this tweet is unavailable or has been deleted.
      </p>
    </div>
  )
}

export default TweetNotFound
