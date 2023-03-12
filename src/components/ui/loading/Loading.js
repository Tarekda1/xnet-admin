import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

function Loading() {
  return (
    <Dimmer active={true} inverted>
      <Loader inverted>Loading</Loader>
    </Dimmer>
  );
}

export { Loading };
