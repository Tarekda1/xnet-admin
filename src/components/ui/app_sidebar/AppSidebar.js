import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getToken } from "@/helpers/utility";
import { Icon, Menu, Sidebar, Image, Header } from "semantic-ui-react";
import logo from "@/images/xnet_logo_main.png";
import "./AppSidebar.less";
function AppSidebar(props) {
  const language = "en";
  const history = useHistory();
  const user = useSelector((state) => state.user.userInfo);
  const visible = useSelector((state) => state.global.showMenu);

  const token = getToken();

  return token ? (
    <Sidebar.Pushable>
      <Sidebar
        as={Menu}
        vertical
        width="thin"
        direction={"left"}
        visible={user.role == "Admin" && visible}
      >
        <Menu.Item>
          <Link to="/admin" className="sidebar__logo">
            {user.role == "AGENT" ? (
              <Image
                className="agent__logo"
                width="88px"
                src={user.ImgProfileUrl}
                alt={user.username}
              />
            ) : (
              <Image width="100px" src={logo} alt="eaga card" />
            )}
          </Link>
        </Menu.Item>
        <Menu.Item icon>
          <Icon
            floated="left"
            name="users"
            style={{ float: "left", margin: "0px 5px" }}
          />
          <Link to="/admin">Subscribers</Link>
        </Menu.Item>
        <Menu.Item icon>
          <Icon
            floated="left"
            name="users"
            style={{ float: "left", margin: "0px 5px" }}
          />
          <Link to="/admin/users">Users</Link>
        </Menu.Item>
        <Menu.Item icon>
          <Icon
            floated="left"
            name="money"
            style={{ float: "left", margin: "0px 5px" }}
          />
          <Link to="/admin/expenses">Expenses</Link>
        </Menu.Item>
      </Sidebar>
      <Sidebar.Pusher
        style={
          language === "en" ? { marginLeft: "0px" } : { marginRight: "0px" }
        }
      >
        {props.children}
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  ) : (
    <div>{props.children}</div>
  );
}

export { AppSidebar };
