import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown"
import React from "react"

const FriendsActionsDropdown = ({user, friendId, deleteFriendHandler}) => {
    return (
        <Dropdown className="dark" shouldBlockScroll={false}>
            <DropdownTrigger>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v.01M12 12v.01M12 18v.01" />
                </svg>
            </DropdownTrigger>
            <DropdownMenu>
                <DropdownItem onPress={()=>deleteFriendHandler(user, friendId)} className="text-danger transition-colors" color="danger">Excluir</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}

export default FriendsActionsDropdown
