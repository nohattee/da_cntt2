import React, { useState, useEffect } from 'react';
import service from "../../service";
import { Link, NavLink, useHistory } from "react-router-dom";
import { AiOutlineSearch } from 'react-icons/ai';
import { VscChromeClose } from 'react-icons/vsc';
import '../css/Nav.css';
import logo from '../../images/logo-white.png';

export default function Nav() {
    const [searchBar, setSearchBar] = useState(false);
    const [sideCategory, setSideCategory] = useState(false);
    const [listCategories, setListCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    let history = useHistory();

    const showSearchBar = () => setSearchBar(!searchBar);
    const showSideCategory = () => {
        setSideCategory(!sideCategory);
    }

    useEffect(() => {
        let mounted = true;
        async function fetchData() {
            const responseCategories = await service.getListCategories();
            if (mounted) {
                setListCategories(responseCategories.results)
            }
        }
        fetchData()
        return () => (mounted = false);
    }, []);

    useEffect(() => {
        sideCategory ? (document.body.style.overflow = 'hidden') :
            (document.body.style.removeProperty('overflow'))
    }, [sideCategory]);

    function handleInput(text) {
        text = text.trim();
        return text
    }

    function handleSubmit(e) {
        if (searchTerm === '') {
            e.preventDefault();
            e.stopPropagation();
        } else {
            history.push({
                pathname: '/search/',
                search: "?" + new URLSearchParams({ key: handleInput(searchTerm) }).toString() + '&' + new URLSearchParams({ page: 1 }),
            });
            showSearchBar();
            setSearchTerm('')
            e.preventDefault();
            e.stopPropagation();
        }
    }

    function handleChange(e) {
        setSearchTerm(e.target.value);
    }

    return (
        <>
            <div className='nav flex justify-between justify-center sticky top-0 text-white px-9 py-1'>
                <div className="menu-wrapper py-5 cursor-pointer" onClick={showSideCategory}>
                    <div className={sideCategory ? 'hamburger-menu animate' : 'hamburger-menu'}></div>
                </div>
                <Link to='/'>
                    <img src={logo} className='mx-auto py-4 w-48 lg:py-2 lg:w-full' alt='logo' />
                </Link>
                <div className='py-2'>
                    <form
                        onSubmit={handleSubmit}
                    >
                        <div className='search-bar absolute right-16 flex w-1/4'
                            style={{ visibility: searchBar ? 'visible' : 'hidden' }}>
                            <label htmlFor='search'
                                className='text-3xl py-2 mr-2'>
                                <AiOutlineSearch />
                            </label>
                            <input
                                type='text'
                                className='focus:outline-none h-10 my-1 py-2 pl-2 text-base lg:text-xl w-full'
                                spellCheck='false'
                                style={{ backgroundColor: '#181716' }}
                                placeholder='Search...'
                                value={searchTerm}
                                onChange={handleChange}
                                name='search'
                            />
                        </div>
                    </form>
                    {
                        searchBar ?
                            (<button
                                className='btn-close focus:outline-none py-2'
                                onClick={showSearchBar} >
                                <VscChromeClose />
                            </button>) :
                            <button
                                className='btn-search focus:outline-none py-2'
                                onClick={showSearchBar}>
                                <AiOutlineSearch />
                            </button>
                    }
                </div>
            </div>
            <div className={sideCategory ? 'side-categories active' : 'side-categories'}>
                <ul className='flex flex-col space-y-10 text-black text-xl text-white py-6 pl-10' >
                    {listCategories.map((category) => (
                        <li key={category.id} className='category text-xl lg:text-2xl cursor-pointer'>
                            <NavLink
                                to={{
                                    pathname: `/categories/${category.id}`,
                                    search: "?" + new URLSearchParams({ page: 1 }).toString(),
                                }}
                                onClick={() => setSideCategory(false)}>
                                <p>
                                    {category.name}
                                </p>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}