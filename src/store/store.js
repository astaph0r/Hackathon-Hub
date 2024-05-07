import { configureStore } from '@reduxjs/toolkit'
import userSlice from '../features/user/userSlice'
import hackathonSlice from '../features/hackathon/hackathonSlice'
import teamSlice from '../features/team/teamSlice'
import evaluatorSlice from '../features/evaluator/evaluatorSlice'
import botSlice from '../features/bot/botSlice'


export default configureStore({
    reducer: {
      user: userSlice,
      hackathon: hackathonSlice,
      team: teamSlice,
      evaluator: evaluatorSlice,
      bot: botSlice,
    }
  })