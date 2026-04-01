import HomeButton from "@/components/HomeButton"
import { FC, PropsWithChildren } from "react"

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex flex-col">
      <HomeButton />
      <div className="m-auto flex w-full max-w-4xl">{children}</div>
    </div>
  )
}

export default Layout
