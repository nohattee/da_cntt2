import React from 'react';
import { Link } from 'react-router-dom';

export default function ErrorMess() {
    return (
        <div className='container mx-auto flex flex-col justify-center items-center  space-y-10 h-96'>
            <h1 className='text-9xl'>SORRY :(</h1>
            <h3 className='text-4xl'>something went wrong</h3>
            <p className='text-2xl text-gray-500'>Additional information: Error during route processing</p>
            <p className='text-xl'>
                Please go back and try agin or go
                <Link to='/'>
                    <span className='ml-2 underline '>back to Home</span>
                </Link>
            </p>
        </div>
    )
}