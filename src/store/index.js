import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit"
import logger from "redux-logger"

import { authReducer } from "src/store/ducks/auth"

const reducer = {
  auth: authReducer,
}

const middleware = [...getDefaultMiddleware(), logger]

const store = configureStore({
  reducer,
  middleware,
  devTools: process.env.NODE_ENV !== "production",
})

export { store }
