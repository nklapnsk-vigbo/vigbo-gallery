import { useSelector } from "react-redux"
import { useRouter } from "next/router"

import { firebase } from "src/services/firebase"
import { Container } from "src/ui/container"
import { Header } from "src/ui/admin/header"
import { Categories } from "src/ui/admin/categories"

export default function Admin() {
  const router = useRouter()
  const { user, loading } = useSelector((state) => state.auth)

  React.useEffect(() => {
    if (!user && loading !== "initial") {
      router.push("/admin/signin")
    }
  }, [user, loading])

  if (!user) {
    return null
  }

  return (
    <Container>
      <Header title="Admin"></Header>
      <CreateNewCategory></CreateNewCategory>
      <Categories></Categories>
    </Container>
  )
}

function CreateNewCategory() {
  const [value, seValue] = React.useState("")
  async function handleCreateCategory(event) {
    event.preventDefault()
    const response = await firebase.firestore().collection("categories").add({ name: value })
    console.log(response)
  }

  function handleInputChange(event) {
    seValue(event.target.value)
  }

  return (
    <form onSubmit={handleCreateCategory}>
      <input type="text" value={value} onChange={handleInputChange} placeholder="category name"></input>
      <button>create new category</button>
    </form>
  )
}
