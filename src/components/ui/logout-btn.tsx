'use client'

import {DropdownMenuItem} from "@/components/ui/dropdown-menu"
import {logout} from "@/app/(pages)/auth/actions";

const LogoutBtn = () => {

    const handleLogout = async () => {
        await logout()
    }

    return (
        <DropdownMenuItem onClick = {handleLogout}>
            Logout
        </DropdownMenuItem>
    )
}
export default LogoutBtn