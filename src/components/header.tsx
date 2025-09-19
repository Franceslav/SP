import React from 'react'
import Container from "@/components/container";
import Link from "next/link";
import {Tv, Video} from 'lucide-react';
import {cn} from "@/lib/utils";
import {buttonVariants} from "@/components/ui/button";
import LoginBtn from "@/components/ui/login-btn";
import UserMenu from "@/components/ui/user-menu";
import {auth} from "@/auth";

interface NavItem{
    title: string,
    href: string,
}

const NavItems: NavItem[] = [
    {
        title:"Главная",
        href:"/gallery",
    },
    {
        title:"Навигация",
        href:"/navigation",
    },
    {
        title:"Персонажи",
        href:"/navigation",
    }

]

const Header = async () =>{
    const session = await auth()
    return(
        <header className='py-6'>
            <Container className='flex items-center justify-between md:!px-12'>
                <Link href='/' className = 'flex item-center gap-2'>
                    <Video className = 'size-6'/>
                    <span className = 'text-lg font-bold'>Video</span>
                </Link>
                <div className='flex-1 flex items-center justify-end gap-2'>
                    <nav className='flex-1 justify-center hidden md:flex'>
                        <ul className='flex items-center gap-6'>
                            {NavItems.map(({title,href}) => (
                                <li key={title}>
                                    <Link href={href} className ='text-sm font-normal'>{title}</Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className='flex items-center justify-end gap-2'>
                        <div className='flex md:hidden'>
                            <Link href='/gallery' className = {cn(buttonVariants({variant:'ghost', size:'icon'}))}>
                                <Tv className = 'size-6'/>
                            </Link>
                        </div>
                        {session?.user ? <UserMenu name = {session.user.name}/> : <LoginBtn/>}
                    </div>
                </div>
            </Container>
        </header>
    )
}

export default Header;