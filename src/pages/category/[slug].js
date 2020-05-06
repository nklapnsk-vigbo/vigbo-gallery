import clsx from "clsx"

import { firebase } from "src/services/firebase"
import { Container } from "src/ui/container"
import { Gallery } from "src/ui/gallery"

export default function Category({ access, photos }) {
  const [password, setPassword] = React.useState()
  React.useEffect(() => {
    if (access) {
      setPassword(true)
      let enteredPassword = prompt("Введите пароль", "")
      if (enteredPassword === access) {
        setPassword(false)
      }
    }
  }, [access])

  const isPhotosAvailable = photos.length > 0

  if (password) {
    return null
  }

  return (
    <Container>
      <Gallery>
        {isPhotosAvailable && photos.map((item) => <CategoryImage key={item.id} url={item.url}></CategoryImage>)}
      </Gallery>
    </Container>
  )
}

function CategoryImage({ url }) {
  const [isVisible, setIsVisible] = React.useState(false)

  function handleImageLoad() {
    setIsVisible(true)
  }

  return <img src={url} className={clsx("photo", { visible: isVisible })} onLoad={handleImageLoad}></img>
}

export async function getServerSideProps(context) {
  const slug = context.params.slug
  const response = await firebase.firestore().collection("categories").doc(slug).get()
  const access = response.data().access

  const photosResponse = await firebase.firestore().collection("categories").doc(slug).collection("photos").get()

  return {
    props: {
      slug,
      access,
      photos: photosResponse.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
    },
  }
}
