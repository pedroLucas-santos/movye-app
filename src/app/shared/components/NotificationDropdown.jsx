"use client"
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown"
import React from "react"
import NotiFriendRequest from "./notificationTypes/NotiFriendRequest"
import NotiGroupRequest from "./notificationTypes/NotiGroupRequest"
import NotiMessage from "./notificationTypes/NotiMessage"
import ToastCustom from "../ToastCustom"
import { toast } from "react-toastify"

const NotificationDropdown = ({ notifications }) => {
    return (
        <>
            <Dropdown className="dark mt-2" closeOnSelect={false} shouldBlockScroll={false}>
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
                <DropdownMenu>
                    <DropdownItem variant="light">
                        {notifications.length > 0 ? (
                            <div className="flex flex-col gap-4 h-full overflow-y-auto">
                                {notifications.map((notification, index) => {
                                    switch (notification.type) {
                                        case "friend-request":
                                            return <NotiFriendRequest key={index} notification={notification} toasty={toast} />
                                        case "group-request":
                                            return <NotiGroupRequest key={index} notification={notification} toasty={toast} />
                                        case "message":
                                            return <NotiMessage key={index} notification={notification} />
                                    }
                                })}
                            </div>
                        ) : (
                            <div className="px-4 py-2 text-sm">Sem novas notificações</div>
                        )}
                    </DropdownItem>
                </DropdownMenu>
                <ToastCustom />
            </Dropdown>
        </>
    )
}

export default NotificationDropdown
