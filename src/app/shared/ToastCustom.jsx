import { ToastContainer } from "react-toastify"
import React from "react"

const ToastCustom = () => {
    return (
        <ToastContainer
            position="top-left"
            hideProgressBar={true}
            pauseOnHover
            newestOnTop={true}
            toastStyle={{
                backgroundColor: "#141414",
                color: "#ffffff",
                borderRadius: "8px",
                padding: "12px",
                fontSize: "14px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
            }}
        />
    )
}

export default ToastCustom
