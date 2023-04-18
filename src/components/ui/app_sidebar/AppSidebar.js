import React, { useState, useEffect } from "react";
import { useHistory, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getToken } from "../../../helpers/utility";
import { Icon, Menu, Sidebar, Image, Header } from "semantic-ui-react";
import logo from "../../../images/xnet_logo_main.png";
import "./AppSidebar.scss";
function AppSidebar(props) {
  const language = "en";
  const user = useSelector((state) => state.user.userInfo);
  const visible = useSelector((state) => state.global.showMenu);
  const location = useLocation();
  const token = getToken();
  console.log(location.pathname);

  return token ? (
    <Sidebar.Pushable>
      <Sidebar
        as={Menu}
        vertical
        width="thin"
        direction={"left"}
        visible={user.role == "Admin" && visible}
      >
        <Menu.Item className="logo">
          <Link to="/admin" className="sidebar__logo">
            {user.role == "AGENT" ? (
              <Image
                className="agent__logo"
                width="88px"
                src={user.ImgProfileUrl}
                alt={user.username}
              />
            ) : (
              <Image width="100px" src={logo} alt="Xnet Billing Portal" />
            )}
          </Link>
        </Menu.Item>
        <Menu.Item
          icon
          className={location.pathname == "/dashboard" ? "active" : ""}
        >
          <Icon
            floated="left"
            name="dashboard"
            style={{ float: "left", margin: "0px 5px" }}
          />
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item
          icon
          className={location.pathname == "/admin/users" ? "active" : ""}
        >
          <Icon
            floated="left"
            name="user"
            style={{ float: "left", margin: "0px 5px" }}
          />
          <Link to="/admin/users">Users</Link>
        </Menu.Item>
        <Menu.Item
          icon
          className={location.pathname == "/admin/subscribers" ? "active" : ""}
        >
          <Icon
            floated="left"
            name="users"
            style={{ float: "left", margin: "0px 5px" }}
          />
          <Link to="/admin/subscribers">Subscribers</Link>
        </Menu.Item>
        <Menu.Item
          icon
          className={location.pathname == "/billing/plans" ? "active" : ""}
        >
          <Icon
            floated="left"
            name="money bill alternate"
            style={{ float: "left", margin: "0px 5px" }}
          />
          <Link to="/billing/plans">Plans</Link>
        </Menu.Item>
        <Menu.Item
          icon
          className={location.pathname == "/billing/invoices" ? "active" : ""}
        >
          <Icon
            floated="left"
            name="money bill alternate"
            style={{ float: "left", margin: "0px 5px" }}
          />
          <Link to="/billing/invoices">Invoices</Link>
        </Menu.Item>
        <Menu.Item
          icon
          className={location.pathname == "/admin/expenses" ? "active" : ""}
        >
          <Icon
            floated="left"
            name="list ul"
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
