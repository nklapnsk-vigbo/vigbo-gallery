import Link from "next/link"
import Head from "next/head"
import { useSelector, useDispatch } from "react-redux"

import { signOut } from "src/store/ducks/auth"

import styles from "./header.module.scss"

export function Header({ title }) {
  const dispatch = useDispatch()

  const { user } = useSelector((store) => store.auth)

  function handleSignOut() {
    dispatch(signOut())
  }

  return (
    <React.Fragment>
      <Head>
        <title>{title}</title>
      </Head>
      <header className={styles.header}>
        <nav>
          <Link href="/admin">
            <a>Admin</a>
          </Link>
          <Link href="/">
            <a>Home</a>
          </Link>
        </nav>

        {user && (
          <nav>
            <button onClick={handleSignOut}>sign out</button>
          </nav>
        )}
      </header>

      <style jsx>{`
        nav a {
          margin-right: 24px;
        }
      `}</style>
    </React.Fragment>
  )
}
