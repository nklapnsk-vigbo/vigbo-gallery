import Link from "next/link"
import { firebase } from "src/services/firebase"

import styles from "./categories.module.scss"
import clsx from "clsx"
import { nanoid } from "nanoid"

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

  const [isVisible, setIsVisible] = React.useState(false)

  function handleImageLoad() {
    setIsVisible(true)
  }

  const [isTextCopied, setIsTextCopied] = React.useState(false)
  function handleShareClick() {
    window.navigator.clipboard.writeText(`${window.location.origin}/category/${id}`)
    setIsTextCopied(true)
    setTimeout(() => setIsTextCopied(false), 2000)
  }

  const [password, setPassword] = React.useState()
  async function handleAccessByPassword(event) {
    if (event.target.checked) {
      const access = nanoid()
      const response = await firebase.firestore().collection("categories").doc(id).update({ access })
      setPassword(access)
    } else {
      await firebase.firestore().collection("categories").doc(id).update({ access: null })
      setPassword(false)
    }
  }

  return (
    <React.Fragment>
      <figure>
        <Link href="/admin/category/[slug]" as={`/admin/category/${id}`}>
          <a>
            <h2>{name}</h2>
            <img src={thumbnail?.url} className={clsx("photo", { visible: isVisible })} onLoad={handleImageLoad}></img>
          </a>
        </Link>
        <footer>
          <button onClick={handleDelete}>Удалить</button>
          <button onClick={handleShareClick}>Поделиться</button>
        </footer>

        <label>
          <span>Доступ по паролю: </span>
          <input type="checkbox" onChange={handleAccessByPassword}></input>
        </label>
        <h1>{password && password}</h1>
      </figure>
      <dialog open={isTextCopied}>
        <h1>ССЫЛКА СОХРАНЕНА В БУФЕР ОБМЕНА</h1>
      </dialog>

      <style jsx>{`
        footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 24px;
        }

        button {
          margin-bottom: 24px;
        }
      `}</style>
    </React.Fragment>
  )
}
