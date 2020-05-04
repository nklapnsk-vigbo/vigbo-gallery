import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

import { firebase } from "src/services/firebase"

const initialState = { loading: "initial", user: null, error: null }

const checkUserAuthStatus = createAsyncThunk("auth/checkUserAuthStatus", async () => {
  return new Promise(function (resolve, reject) {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        resolve(user.uid)
      } else {
        reject()
      }
    })
  })
})

const signUpWithEmailAndPassword = createAsyncThunk("auth/signUpWithEmailAndPassword", async ({ email, password }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const newUser = await firebase.auth().createUserWithEmailAndPassword(email, password)
      await firebase.firestore().collection("users").add({ role: "admin", email, uid: newUser.user.uid })
      resolve(newUser.user.uid)
    } catch ({ error, message }) {
      reject({ error, message })
    }
  })
})

const signInWithEmailAndPassword = createAsyncThunk("auth/signInWithEmailAndPassword", async ({ email, password }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await firebase.auth().signInWithEmailAndPassword(email, password)
      resolve(response.user.uid)
    } catch ({ error, message }) {
      reject({ error, message })
    }
  })
})

const signOut = createAsyncThunk("auth/signOut", async () => {
  await firebase.auth().signOut()
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: {
    [checkUserAuthStatus.fulfilled]: (state, action) => {
      state.loading = "idle"
      state.user = { id: action.payload }
    },
    [checkUserAuthStatus.rejected]: (state) => {
      state.loading = "idle"
    },
    [signUpWithEmailAndPassword.pending]: (state) => {
      state.loading = "pending"
    },
    [signUpWithEmailAndPassword.fulfilled]: (state, action) => {
      state.loading = "idle"
      state.user = { id: action.payload }
    },
    [signUpWithEmailAndPassword.rejected]: (state, action) => {
      state.loading = "idle"
      state.error = action.error
    },
    [signInWithEmailAndPassword.pending]: (state) => {
      state.loading = "pending"
    },
    [signInWithEmailAndPassword.fulfilled]: (state, action) => {
      state.loading = "idle"
      state.user = { id: action.payload }
    },
    [signInWithEmailAndPassword.rejected]: (state, action) => {
      state.loading = "idle"
      state.error = action.error
    },
    [signOut.pending]: (state) => {
      state.loading = "pending"
    },
    [signOut.fulfilled]: (state) => {
      state.loading = "idle"
      state.user = null
    },
  },
})

const authReducer = authSlice.reducer

export { authReducer, checkUserAuthStatus, signUpWithEmailAndPassword, signOut, signInWithEmailAndPassword }
