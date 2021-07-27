import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import logo from '../../images/logo-black.png';

export default function Footer() {
    return (
        <>
            <div className='flex flex-col border-t-2 border-b-2 border-gray-200 p-10'>
                <Link to='/' className='mx-auto mb-10' >
                    <img src={logo} alt='logo' />
                </Link>
                <ul className='list-none flex flex-row justify-center space-x-5 lg:space-x-10 cursor-pointer'
                    style={{ fontSize: '25px' }}>
                    <li className='border-2 border-gray-200 rounded-full h-16 w-16 flex items-center justify-center'><FaFacebookF /></li>
                    <li className='border-2 border-gray-200 rounded-full h-16 w-16 flex items-center justify-center'><FaInstagram /></li>
                    <li className='border-2 border-gray-200 rounded-full h-16 w-16 flex items-center justify-center'><FaTwitter /></li>
                </ul>
            </div>
            <div className='text-center mt-6'>
                <p>Copyright © 2021</p>
            </div>
        </>
    )
}