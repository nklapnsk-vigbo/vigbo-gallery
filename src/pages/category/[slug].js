import clsx from "clsx"

import { firebase } from "src/services/firebase"
import { Container } from "src/ui/container"
import { Gallery } from "src/ui/gallery"

export default function Category({ slug }) {
  const [categoryData, setCategoryData] = React.useState([])

  React.useEffect(() => {
    return firebase
      .firestore()
      .collection("categories")
      .doc(slug)
      .collection("photos")
      .onSnapshot(function (snapshot) {
        let snapshotCategories = []
        snapshot.forEach((doc) => snapshotCategories.push({ ...doc.data(), id: doc.id }))
        setCategoryData(snapshotCategories)
      })
  }, [])

  const isCategoriesAvailable = categoryData.length > 0

  return (
    <Container>
      <Gallery>
        {isCategoriesAvailable &&
          categoryData.map((item) => <CategoryImage key={item.id} url={item.url}></CategoryImage>)}
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
  return {
    props: {
      slug: context.params.slug,
    },
  }
}
