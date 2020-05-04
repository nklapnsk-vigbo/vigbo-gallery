import { useDropzone } from "react-dropzone"
import { nanoid } from "nanoid"

import { firebase } from "src/services/firebase"
import { Container } from "src/ui/container"
import { Header } from "src/ui/admin/header"
import { Category as CategoryWrapper } from "src/ui/admin/category"

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

  const [files, setFiles] = React.useState([])
  const onDrop = React.useCallback((acceptedFiles) => {
    setFiles(acceptedFiles)
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

          setFiles([])
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
        <h1>Upload file</h1>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </div>
        <span>Files to upload: {files.length}</span>
      </section>

      <CategoryWrapper>
        {isCategoriesAvailable && categoryData.map((item) => <img key={item.id} src={item.url} alt=""></img>)}
      </CategoryWrapper>
    </Container>
  )
}

export async function getServerSideProps(context) {
  return {
    props: {
      slug: context.params.slug,
    },
  }
}
