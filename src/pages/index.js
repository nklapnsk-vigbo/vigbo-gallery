import Link from "next/link"

export default function Home() {
  return (
    <React.Fragment>
      <main>
        <h1>Vigbo gallery</h1>
        <Link href="/admin">
          <a>Админка</a>
        </Link>
      </main>
      <style jsx>{`
        h1 {
          font-size: 4vmin;
        }

        main {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          flex-direction: column;
        }
      `}</style>
    </React.Fragment>
  )
}
