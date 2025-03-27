
import React from "react"

const Layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className="flex flex-col min-h-screen">
        {children}
    </div>
  )
}

export default Layout