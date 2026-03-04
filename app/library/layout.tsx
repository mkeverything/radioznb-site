import HomeButton from "@/components/HomeButton"
import { FC, PropsWithChildren } from "react"

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col">
      <HomeButton />
      <div className="flex max-w-4xl m-auto w-full">{children}</div>
    </div>
  )
}

export default Layout
