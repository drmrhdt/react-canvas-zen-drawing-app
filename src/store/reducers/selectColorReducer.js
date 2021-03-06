import {
  SELECT_STROKE_STYLE,
  SELECT_SHADOW_COLOR,
  SELECT_FILL_STYLE
} from "../constants";

const initialState = {
  strokeStyle: "#000000",
  fillStyle: "#000000",
  shadowColor: "#292b2c"
};

export const selectColorReducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_STROKE_STYLE:
      return {
        ...state,
        strokeStyle: action.payload
      };
    case SELECT_FILL_STYLE:
      return {
        ...state,
        fillStyle: action.payload
      };
    case SELECT_SHADOW_COLOR:
      return {
        ...state,
        shadowColor: action.payload
      };
    default:
      return state;
  }
};
