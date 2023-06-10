import React, { useState } from 'react';
import logo from '../../assets/solshamans_logo.png'
import './Header.css';
import { BsSearch, BsList } from 'react-icons/bs'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'

function Header() {
    const [showDropdown, setShowDropdown] = useState(false)
    const [number, setNumber] = useState(0)
    const dropdownClick = n => {
        setNumber(n)
    }
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown)
    }
    return (
        <div className=' top-0 bg-black header-wrapper w-100 app-max-width'>
            <div className='m-auto pt-4 pb-2 d-flex justify-content-between header px-5 px-lg-0'>
                <img src={logo} alt="" className='logo' />
                <div>
                    <span className='d-lg-inline d-none'>
                        <a
                            role="button"
                            className='h-btn bg-transparent border-0 shadow-none px-2 text-decoration-none'
                            href='https://solshamans.com'
                        >
                            Home
                        </a>
                        <a
                            role="button"
                            className='h-btn bg-transparent border-0 shadow-none px-2 text-decoration-none'
                            href='#'
                        >
                            Mint Pass
                        </a>
                        <a
                            role="button"
                            className='h-btn bg-transparent border-0 shadow-none px-2 text-decoration-none'
                            href='#'
                        >
                            SOL Collection
                        </a>
                        <a
                            role="button"
                            className='h-btn bg-transparent border-0 shadow-none px-2 text-decoration-none'
                            href='https://discord.com/invite/shamans'
                        >
                            Discord
                        </a>
                        <a
                            role="button"
                            className='h-btn bg-transparent border-0 shadow-none px-2 text-decoration-none'
                            href='https://twitter.com/solshamans'
                        >
                            Twitter
                        </a>
                    </span>
                    <Button className='h-btn bg-transparent border-0 shadow-none'><BsSearch className='search-icon text-28' /></Button>

                    <Dropdown
                        isOpen={showDropdown}
                        toggle={toggleDropdown}
                        className='d-inline'
                    >
                        <DropdownToggle
                            className=' bg-transparent border-0 p-0 shadow-none'
                        >
                            <BsList className='menu-color text-32 d-inline d-lg-none' />
                        </DropdownToggle>
                        <DropdownMenu className='w-100vw bg-black color-gold border-blue'

                        >
                            <DropdownItem className='color-gold py-3'>
                                <a
                                    role="button"
                                    className='h-btn bg-transparent border-0 shadow-none px-2 text-decoration-none'
                                    href='https://solshamans.com'
                                >
                                    Home
                                </a>
                            </DropdownItem>
                            <DropdownItem className='color-gold py-3'>
                                <a
                                    role="button"
                                    className='h-btn bg-transparent border-0 shadow-none px-2 text-decoration-none'
                                    href='#'
                                >
                                    Mint Pass
                                </a>
                            </DropdownItem>
                            <DropdownItem className='color-gold py-3'>
                                <a
                                    role="button"
                                    className='h-btn bg-transparent border-0 shadow-none px-2 text-decoration-none'
                                    href='#'
                                >
                                    SOL Collection
                                </a>
                            </DropdownItem>
                            <DropdownItem className='color-gold py-3'>
                                <a
                                    role="button"
                                    className='h-btn bg-transparent border-0 shadow-none px-2 text-decoration-none'
                                    href='https://discord.com/invite/shamans'
                                >
                                    Discord
                                </a>
                            </DropdownItem>
                            <DropdownItem className='color-gold py-3'>
                                <a
                                    role="button"
                                    className='h-btn bg-transparent border-0 shadow-none px-2 text-decoration-none'
                                    href='https://twitter.com/solshamans'
                                >
                                    Twitter
                                </a>
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </div>
        </div>
    );
}

export default Header;