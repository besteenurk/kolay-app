import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../stores/store";

export interface ITableTask {
  id: any;
  name: string;
  code: string;
  assignDate: any;
  editable: boolean;
}

export interface TaskState {
  loading: boolean;
  task: Array<ITableTask>;
  error: string | undefined;
}

const initialState: TaskState = {
  loading: false,
  task: [],
  error: undefined,
}

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<ITableTask>) => {
      state.task.push(action.payload);
    },
    deleteTask: (state, action: PayloadAction<ITableTask>) => {
      state.task = state.task.filter((val) => val.id !== action.payload.id);
    },
    putTask:(state, action)=>{
      state.task = state.task
      .map((todo)=>{
        if(todo.id===action.payload.id){
          todo.assignDate=action.payload.assignDate;
          todo.code=action.payload.code;
          todo.name=action.payload.name;
          todo.editable=action.payload.editable;
        }
        return todo;
      });
    }
  },
});
export const { addTask, deleteTask, putTask } =
  taskSlice.actions;
export const taskSelector = (state: RootState) => state.taskSlice;
export default taskSlice.reducer;