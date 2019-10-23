import { GET_ERRORS } from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS: {
      return action.payload;
    }
    // We don't change or mutate the state - we make a copy of it
    // Want to take the initial state (state) and add to it
    default:
      return state;
  }
}
