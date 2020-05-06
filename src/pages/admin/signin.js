import { useDispatch, useSelector } from "react-redux"
import Link from "next/link"
import { useRouter } from "next/router"

import { Container } from "src/ui/container"
import { Header } from "src/ui/admin/header"
import { signInWithEmailAndPassword } from "src/store/ducks/auth"

export default function SignIn() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user } = useSelector((store) => store.auth)

  function handleSignIn(event) {
    event.preventDefault()
    const { email, password } = event.target.elements
    dispatch(signInWithEmailAndPassword({ email: email.value, password: password.value }))
  }

  React.useEffect(() => {
    if (user) {
      router.push("/admin")
    }
  }, [user])

  if (user) {
    return null
  }

  return (
    <Container>
      <Header title="Sign in"></Header>

      <form onSubmit={handleSignIn}>
        <input name="email" type="email" placeholder="Email" />
        <input name="password" type="password" placeholder="Password" />
        <button type="submit">Войти</button>
      </form>

      <Link href="/admin/signup">
        <a>У меня нет аккаунта</a>
      </Link>
    </Container>
  )
}
