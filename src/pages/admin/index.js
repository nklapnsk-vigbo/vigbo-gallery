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
  const router = useRouter()

  async function handleCreateCategory(event) {
    event.preventDefault()
    let name = prompt("Введите название для коллекции", "Свадьба, 20.02.2020")
    const response = await firebase.firestore().collection("categories").add({ name })
    router.push("/admin/category/[slug]", `/admin/category/${response.id}`)
  }

  return (
    <form onSubmit={handleCreateCategory}>
      <button>Создать новую коллекцию</button>
    </form>
  )
}
