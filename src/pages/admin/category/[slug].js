import { useDropzone } from "react-dropzone"
import { nanoid } from "nanoid"
import clsx from "clsx"

import { firebase } from "src/services/firebase"
import { Container } from "src/ui/container"
import { Header } from "src/ui/admin/header"
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

  const onDrop = React.useCallback((acceptedFiles) => {
    const storageRef = firebase.storage().ref()
    acceptedFiles.forEach((file) => {
      // Добавляем к имени файла рандомный хэш, потому что если в сторадже уже есть файл с таким же именем - происходят непонятки
      const uploadTask = storageRef.child(`${nanoid()}@${file.name}`).put(file)

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log(file.name, Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100))
        },
        (error) => console.log(error),
        () => {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then((url) => firebase.firestore().collection("categories").doc(slug).collection("photos").add({ url }))
        }
      )
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const isCategoriesAvailable = categoryData.length > 0

  return (
    <Container>
      <Header title={slug}></Header>
      <section>
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="dropzone-title">Drop the files here ...</p>
          ) : (
            <p className="dropzone-title">Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
      </section>

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
