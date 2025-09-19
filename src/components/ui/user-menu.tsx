import {type FC} from 'react'
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import LogoutBtn from "@/components/ui/logout-btn";

interface Props {
    name: string | null | undefined
}

const UserMenu: FC<Props> = ({name}) =>{
    return (
        <DropdownMenu modal ={false}>
            <DropdownMenuTrigger>
                <Avatar className = 'shadow-md'>
                    <AvatarFallback>
                        {name}
                        </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>
                    My account
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem disabled> Profile </DropdownMenuItem>
                <DropdownMenuItem disabled> Profile </DropdownMenuItem>
                <DropdownMenuItem disabled> Profile </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <LogoutBtn/>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserMenu;