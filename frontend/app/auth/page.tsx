import { redirect } from "next/navigation"

const Page = () => {
  return redirect("/auth/login")
}

export default Page
