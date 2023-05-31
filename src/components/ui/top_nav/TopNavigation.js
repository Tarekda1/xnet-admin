import React, { useState, useEffect, useCallback, useContext } from "react";
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
import moment from "moment";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import i18n from "../../../Translation";
import userActions from "../../../actions/userActions";
import { useNavigate } from "react-router-dom";
import { globalActions } from "../../../actions/globalActions";
import styles from "./TopNavigation.module.scss";
import { AuthContext, useAuth } from "../../../context/AuthContext";

const BorderLessSegment = styled(Segment)({
  border: "none!important",
  margin: "0!important",
  padding: "0 10px 0 0 !important",
  boxShadow: "none!important",
});

const TopNavigation = () => {
  const user = useSelector((state) => state.user.userInfo);
  const { currentUser } = useContext(AuthContext);
  const visible = useSelector((state) => state.global.showMenu);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      navigate("/account/login");
    }
  }

  function onLanguageChange(element, data) {
    i18n.changeLanguage(data.value);
    dispatch(globalActions.changeLanguage(data.value));
  }
  const toggleMenu = useCallback(() => {
    dispatch(globalActions.toggleMenu(false));
  }, [visible]);

  return currentUser ? (
    <Grid stackable className={styles.topNavigationContainer}>
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
          className={styles.menu__icon}
          style={{ width: "40px", height: "40px" }}
          onClick={toggleMenu}
        >
          <Icon name="bars" style={{ margin: 0 }} size="large" />
        </Button>
      </BorderLessSegment>
      <Grid.Column className={styles.squeez} floated="right">
        <BorderLessSegment>
          <h4 style={{ margin: 0, paddingRight: "10px", fontWeight: "normal" }}>
            Logged in as:{" "}
            <span style={{ fontWeight: "bold" }}>{user.username}</span>
          </h4>
        </BorderLessSegment>
        <BorderLessSegment>
          <h4 style={{ margin: 0, paddingRight: "10px" }}>
            {moment(new Date()).format("DD-MM-YYYY")}
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
