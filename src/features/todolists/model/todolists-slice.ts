import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"
import { todolistsApi } from "@/features/todolists/api/todolistsApi.ts"

export const todolistsSlice = createSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  selectors: {
    selectTodolists: (state) => state,
  },
  reducers: (create) => ({
    // setTodolistsAC: create.reducer<{ todolists: Todolist[] }>((state, action) => {
    //   action.payload.todolists.forEach((todolist) => {
    //     state.push({ ...todolist, filter: "all" })
    //   })
    // }),
    // deleteTodolistAC: create.reducer<{ id: string }>((state, action) => {
    //   const index = state.findIndex((todolist) => todolist.id === action.payload.id)
    //   if (index !== -1) {
    //     state.splice(index, 1)
    //   }
    // }),
    // changeTodolistTitleAC: create.reducer<{ id: string; title: string }>((state, action) => {
    //   const index = state.findIndex((todolist) => todolist.id === action.payload.id)
    //   if (index !== -1) {
    //     state[index].title = action.payload.title
    //   }
    // }),
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),
    // createTodolistAC: create.preparedReducer(
    //   (title: string) => {
    //     return {
    //       payload: {
    //         title,
    //         id: nanoid(),
    //       },
    //     }
    //   },
    //   (state, action) => {
    //     state.push({ ...action.payload, filter: "all", addedDate: "", order: 0 })
    //   },
    // ),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(setTodolists.fulfilled, (state, action) => {
        action.payload?.todolists.forEach((todolist) => {
          state.push({ ...todolist, filter: "all" })
        })
      })
      .addCase(createTodolist.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todiolist, filter: "all" })
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state[index].title = action.payload.title
        }
      })
      .addCase(deleteTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((todolist) => todolist.id === action.payload.id)
        if (index !== -1) {
          state.splice(index, 1)
        }
      })
  },
})

// 1 вариант
// export const setTodolistsTC = createAsyncThunk(`${todolistsSlece.name}/setTodolistsTC`, (_arg, thunkAPI) => {
//   const { dispatch } = thunkAPI
//   //1. side effect - обращаемся из BLL к DALL
//   todolistsApi.getTodolists().then((res) => {
//     //2. set data to state
//     dispatch(setTodolistsAC({ todolists: res.data }))
//   })
// })

// // 2 вариант более популярный
// export const setTodolistsTC = createAsyncThunk(`${todolistsSlece.name}/setTodolistsTC`, async (_arg, { dispatch }) => {
//   try {
//     const res = await todolistsApi.getTodolists()
//     dispatch(setTodolistsAC({ todolists: res.data }))
//   } catch (error) {
//     console.log(error)
//   }
// })

// 2 вариант более популярный без экшн креэйтора но с экстраредьюсером
export const setTodolists = createAsyncThunk(
  `${todolistsSlice.name}/setTodolists`,
  async (_arg, { rejectWithValue }) => {
    try {
      const res = await todolistsApi.getTodolists()
      return { todolists: res.data }
    } catch (error) {
      return rejectWithValue(error)
    }
  },
)

export const changeTodolistTitle = createAsyncThunk(
  `${todolistsSlice.name}/changeTodolistTitle`,
  async (args: { id: string; title: string }, { rejectWithValue }) => {
    try {
      await todolistsApi.changeTodolistTitle(args)
      return args
    } catch (error) {
      return rejectWithValue(null)
    }
  },
)

export const createTodolist = createAsyncThunk(
  `${todolistsSlice.name}/createTodolist`,
  async (title: string, thunkAPI) => {
    try {
      const res = await todolistsApi.createTodolist(title)
      return { todiolist: res.data.data.item }
    } catch (err) {
      return thunkAPI.rejectWithValue(null)
    }
  },
)

export const deleteTodolist = createAsyncThunk(
  `${todolistsSlice.name}/deleteTodolist`,
  async (id: string, thunkAPI) => {
    try {
      await todolistsApi.deleteTodolist(id)
      return { id }
    } catch (err) {
      return thunkAPI.rejectWithValue(null)
    }
  },
)

export const todolistsReducer = todolistsSlice.reducer
export const { changeTodolistFilterAC } = todolistsSlice.actions
export const { selectTodolists } = todolistsSlice.selectors

// export const deleteTodolistAC = createAction<{ id: string }>("todolists/deleteTodolist")
// export const createTodolistAC = createAction("todolists/createTodolist", (title: string) => {
//   return { payload: { title, id: nanoid() } }
// })
// export const changeTodolistTitleAC = createAction<{ id: string; title: string }>("todolists/changeTodolistTitle")
// export const changeTodolistFilterAC = createAction<{ id: string; filter: FilterValues }>(
//   "todolists/changeTodolistFilter",
// )

// export const todolistsReducer = createReducer(initialState, (builder) => {
//   builder
// .addCase(deleteTodolistAC, (state, action) => {
//   const index = state.findIndex((todolist) => todolist.id === action.payload.id)
//   if (index !== -1) {
//     state.splice(index, 1)
//   }
// })
// .addCase(createTodolistAC, (state, action) => {
//   state.push({ ...action.payload, filter: "all" })
// })
// .addCase(changeTodolistTitleAC, (state, action) => {
//   const index = state.findIndex((todolist) => todolist.id === action.payload.id)
//   if (index !== -1) {
//     state[index].title = action.payload.title
//   }
// })
// .addCase(changeTodolistFilterAC, (state, action) => {
//   const todolist = state.find((todolist) => todolist.id === action.payload.id)
//   if (todolist) {
//     todolist.filter = action.payload.filter
//   }
// })
// })

export type DomainTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
