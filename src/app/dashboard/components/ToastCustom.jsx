import { ToastContainer } from "react-toastify"
import React from "react"

const ToastCustom = () => {
    return (
        <ToastContainer
            position="top-left"
            hideProgressBar={true}
            newestOnTop={true}
            toastStyle={{
                backgroundColor: "#1f1f1f",
                color: "#ffffff",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "14px",
            }}
        />
    )
}

export default ToastCustom
