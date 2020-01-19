const initialState = {
  figure: null
};

export const selectFigureReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SELECT_CIRCLE_TOOL":
      return {
        ...state,
        figure: "circle"
      };
    case "SELECT_SQUARE_TOOL":
      return {
        ...state,
        figure: "square"
      };
    case "SELECT_RECTANGLE_TOOL":
      return {
        ...state,
        figure: "rectangle"
      };
    case "SELECT_LINE_TOOL":
      return {
        ...state,
        figure: "line"
      };
    default:
      return state;
  }
};