"use client"
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown"
import React from "react"
import NotiFriendRequest from "./notificationTypes/NotiFriendRequest"
import NotiGroupRequest from "./notificationTypes/NotiGroupRequest"
import NotiMessage from "./notificationTypes/NotiMessage"
import { toast } from "react-toastify"
import NotiGroupWatched from "./notificationTypes/NotiGroupWatched"
import NotiReview from "./notificationTypes/NotiReview"

const NotificationDropdown = ({ notifications }) => {
    return (
        <>
            <Dropdown className="dark mt-2 text-white" closeOnSelect={false} shouldBlockScroll={false} aria-selected={false}>
                <DropdownTrigger>
                    <svg
                        id="notifications"
                        className="w-6 h-6 cursor-pointer"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5"
                        ></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19a2 2 0 100-4 2 2 0 000 4z"></path>
                    </svg>
                </DropdownTrigger>
                <DropdownMenu className="outline-none" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                            <DropdownItem key={index} variant="light" isReadOnly className="cursor-auto">
                                {(() => {
                                    switch (notification.type) {
                                        case "friend-request":
                                            return <NotiFriendRequest notification={notification} toasty={toast} />
                                        case "group-request":
                                            return <NotiGroupRequest notification={notification} toasty={toast} />
                                        case "group-watched":
                                            return <NotiGroupWatched notification={notification} toasty={toast} />
                                        case "review":
                                            return <NotiReview notification={notification} toasty={toast}/>
                                        case "message":
                                            return <NotiMessage notification={notification} />
                                        default:
                                            return null
                                    }
                                })()}
                            </DropdownItem>
                        ))
                    ) : (
                        <DropdownItem variant="none">
                            <div className="px-4 py-2 text-sm hover:cursor-auto">Sem novas notificações</div>
                        </DropdownItem>
                    )}
                </DropdownMenu>
            </Dropdown>
        </>
    )
}

export default NotificationDropdown
