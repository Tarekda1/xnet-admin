import React from "react";
import { useHistory } from "react-router-dom";

function UseHistory() {
  const history = useHistory();
  return { history };
}

export { UseHistory };
