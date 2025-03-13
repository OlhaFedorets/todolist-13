import { createSlice, nanoid } from "@reduxjs/toolkit"
import { Todolist } from "@/features/todolists/api/todolistsApi.types.ts"

export const todolistsSlece = createSlice({
  name: "todolists",
  initialState: [] as DomainTodolist[],
  reducers: (create) => ({
    setTodolistsAC: create.reducer<{ todolists: Todolist[] }>((state, action) => {
      action.payload.todolists.forEach((todolist) => {
        state.push({ ...todolist, filter: "all" })
      })
    }),
    deleteTodolistAC: create.reducer<{ id: string }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state.splice(index, 1)
      }
    }),
    changeTodolistTitleAC: create.reducer<{ id: string; title: string }>((state, action) => {
      const index = state.findIndex((todolist) => todolist.id === action.payload.id)
      if (index !== -1) {
        state[index].title = action.payload.title
      }
    }),
    changeTodolistFilterAC: create.reducer<{ id: string; filter: FilterValues }>((state, action) => {
      const todolist = state.find((todolist) => todolist.id === action.payload.id)
      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),
    createTodolistAC: create.preparedReducer(
      (title: string) => {
        return {
          payload: {
            title,
            id: nanoid(),
          },
        }
      },
      (state, action) => {
        state.push({ ...action.payload, filter: "all", addedDate: "", order: 0 })
      },
    ),
  }),
})

export const todolistsReducer = todolistsSlece.reducer
export const { setTodolistsAC, deleteTodolistAC, changeTodolistTitleAC, changeTodolistFilterAC, createTodolistAC } =
  todolistsSlece.actions

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
