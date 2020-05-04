import { firebase } from "src/services/firebase"
import { Container } from "src/ui/container"
import { Gallery } from "src/ui/gallery"

export default function Home({ wallpapersData }) {
  const isWallpapersAvailable = wallpapersData.length > 0

  return (
    <Container fluid>
      <Gallery>
        {isWallpapersAvailable && wallpapersData.map((item) => <Walpapper key={item.id} {...item}></Walpapper>)}
      </Gallery>
    </Container>
  )
}

function Walpapper({ url }) {
  return <img src={url} alt="" loading="lazy"></img>
}

export async function getStaticProps() {
  const response = await firebase.firestore().collection("wallpapers").get()
  const wallpapersData = response.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

  return {
    props: {
      wallpapersData,
    },
  }
}
