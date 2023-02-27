import * as React from "react"; // eslint-disable-line
import { Button, ButtonProps, Label, Icon } from "semantic-ui-react"; // eslint-disable-line
import "./uploadfile.less";

const UploadFile = ({
  button = {},
  input,
  size,
  showbutton = true,
  showicon = true,
  labelText = "Select File",
  showLabel = true,
  inputRef,
  visible,
}) => {
  let hiddenInput;
  return (
    <React.Fragment>
      <div className="uploadcontainer" hidden={!visible}>
        <Button
          icon
          htmlFor={input.id}
          onClick={() => hiddenInput.click()}
          {...button}
        >
          {showicon && (
            <Icon
              className="uploadcontainer__actionicon"
              size="huge"
              name="file excel"
            />
          )}
          <label hidden={!showLabel} style={{ marginTop: "15px" }}>
            {labelText}
          </label>
        </Button>
        <input
          hidden
          ref={(el) => {
            hiddenInput = el;
            inputRef.current = el;
          }}
          type="file"
          {...input}
        />
      </div>
    </React.Fragment>
  );
};

export { UploadFile };
