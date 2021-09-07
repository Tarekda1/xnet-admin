import React, { useState, useEffect, useCallback } from "react";
import {
  Dropdown,
  Menu,
  Grid,
  Button,
  Header,
  Segment,
  Image,
  Icon,
} from "semantic-ui-react";
import "./TopNavigation.less";
import { useSelector, useDispatch } from "react-redux";
import userActions from "@/_actions/userActions";
import { Link, useHistory } from "react-router-dom";
import { globalActions } from "@/_actions/globalActions";
import { useTranslation } from "react-i18next";
import moment from "moment";
import styled from "styled-components";
const BorderLessSegment = styled(Segment)({
  border: "none!important",
  margin: "0!important",
  padding: "0 10px 0 0 !important",
  boxShadow: "none!important",
});

const TopNavigation = ({ i18n }) => {
  //const token = localStorage.getItem('token');
  const user = useSelector((state) => state.user.userInfo);
  const token = useSelector((state) => state.user.token);
  const visible = useSelector((state) => state.global.showMenu);
  const dispatch = useDispatch();
  const history = useHistory();
  const language = useSelector((state) => state.global.language);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  useEffect(() => {
    console.log(language);
    if (language !== undefined) {
      setSelectedLanguage(language);
    }
    i18n.changeLanguage(language);
  }, [dispatch, language]);

  const { t } = useTranslation();

  let dropdown = [
    {
      key: "username",
      text: user && user.firstName,
      value: "username",
    },
    {
      key: "Logout",
      text: "Logout",
      value: "logout",
    },
  ];

  let languageSelection = [
    {
      key: 1,
      text: "English",
      value: "en",
    },
    {
      key: 2,
      text: "العربية",
      value: "ar",
    },
  ];

  function onDropdownSelection(element, data) {
    if (data.value === "logout") {
      dispatch(userActions.performLogout());
      history.push("/");
      window.location.reload();
    }
  }

  function onLanguageChange(element, data) {
    i18n.changeLanguage(data.value);
    dispatch(globalActions.changeLanguage(data.value));
  }
  const toggleMenu = useCallback(() => {
    dispatch(globalActions.toggleMenu(false));
  }, [visible]);

  return token ? (
    <Grid stackable className="topNavigationContainer">
      {/* <Grid.Column className="logo" width={2}>
				<Link to="/">
					{user.role == 'AGENT' ? (
						<Image className="agent__logo" width="88px" src={user.ImgProfileUrl} alt={user.username} />
					) : (
						<Image width="100px" src={logo} alt="eaga card" />
					)}
				</Link>
			</Grid.Column> */}
      <BorderLessSegment style={{ display: "flex" }} floated="left">
        <Button
          className="menu__icon"
          style={{ width: "40px", height: "40px" }}
          onClick={toggleMenu}
        >
          <Icon name="bars" style={{ margin: 0 }} size="large" />
        </Button>
      </BorderLessSegment>
      <Grid.Column className="squeez" floated="right">
        {/* <BorderLessSegment>
          <h4 style={{ margin: 0, paddingRight: "10px" }}>
            Welcome {user.username}
          </h4>
        </BorderLessSegment> */}
        <BorderLessSegment>
          <h4 style={{ margin: 0, paddingRight: "10px" }}>
            {moment(new Date()).format("dd-mm-yyyy")}
          </h4>
        </BorderLessSegment>
        <Menu floated="right" compact>
          <Dropdown
            text={user.username}
            options={dropdown}
            onChange={onDropdownSelection}
            simple
            item
          />
        </Menu>
        {/* <Menu floated="right" compact>
          <Dropdown
            key={selectedLanguage}
            defaultValue={selectedLanguage.toString()}
            options={languageSelection}
            onChange={onLanguageChange}
            simple
            item
          />
        </Menu> */}
      </Grid.Column>
    </Grid>
  ) : (
    ""
  );
};

export { TopNavigation };
