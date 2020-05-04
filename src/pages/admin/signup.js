import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/router"
import Link from "next/link"

import { Container } from "src/ui/container"
import { Header } from "src/ui/admin/header"
import { firebase } from "src/services/firebase"
import { signUpWithEmailAndPassword } from "src/store/ducks/auth"

export default function SignUp() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { error, user } = useSelector((store) => store.auth)

  React.useEffect(() => {
    if (error) {
      alert(error.message)
    }
  }, [error])

  React.useEffect(() => {
    if (user) {
      router.push("/admin")
    }
  }, [user])

  if (user) {
    return null
  }

  function handleSignUp(event) {
    event.preventDefault()
    const { email, password } = event.target.elements
    dispatch(signUpWithEmailAndPassword({ email: email.value, password: password.value }))
  }

  async function getUserToken() {
    var userId = firebase.auth().currentUser.uid
    console.log(userId)

    firebase
      .firestore()
      .collection("users")
      .where("uid", "==", userId)

      .get()
      .then((snap) => {
        snap.forEach((doc) => {
          console.log(doc.data())
        })
      })

    //     const response = await firebase.firestore().collection("users").get()
    //     const wallpapersData = response.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

    // console.log(wallpapersData)
  }

  return (
    <Container>
      <Header title="Sign in"></Header>

      <form onSubmit={handleSignUp}>
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required />
        <button type="submit">sign up</button>
      </form>

      <Link href="/admin/signin">
        <a>sign in</a>
      </Link>
    </Container>
  )
}
