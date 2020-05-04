import Link from "next/link"
import { firebase } from "src/services/firebase"

import styles from "./categories.module.scss"

export function Categories() {
  const [categories, setCategories] = React.useState([])

  React.useEffect(() => {
    return firebase
      .firestore()
      .collection("categories")
      .onSnapshot((snapshot) => {
        let snapshotCategories = []
        snapshot.forEach((doc) => {
          snapshotCategories.push({ ...doc.data(), id: doc.id })
        })
        setCategories(snapshotCategories)
      })
  }, [])

  return (
    <section className={styles.categories}>
      {categories.length > 0 && categories.map((category) => <Category key={category.id} {...category}></Category>)}
    </section>
  )
}

function Category({ id, name }) {
  // Запрос дергается для каждой категории, переделать

  const [thumbnail, setThumbnail] = React.useState({})

  React.useEffect(() => {
    async function fetchData() {
      const response = await firebase.firestore().collection("categories").doc(id).collection("photos").get()
      const categories = response.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      setThumbnail(categories[0])
    }
    fetchData()
  }, [])

  async function handleDelete() {
    await firebase.firestore().collection("categories").doc(id).delete()
  }

  return (
    <figure>
      <Link href="/admin/category/[slug]" as={`/admin/category/${id}`}>
        <a>
          <img src={thumbnail?.url}></img>
          {name}
        </a>
      </Link>
      <button onClick={handleDelete}>DELETE CATEGORY</button>
    </figure>
  )
}
