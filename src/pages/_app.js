import { Provider } from "react-redux"
import { useDispatch } from "react-redux"

import { checkUserAuthStatus } from "src/store/ducks/auth"
import { store } from "src/store"

import "src/assets/styles/global.scss"

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ProviderConsumer>
        <Component {...pageProps}></Component>
      </ProviderConsumer>
    </Provider>
  )
}

function ProviderConsumer({ children }) {
  const dispatch = useDispatch()

  // Initial auth service loading
  React.useEffect(() => {
    dispatch(checkUserAuthStatus())
  }, [])

  return <React.Fragment>{children}</React.Fragment>
}
