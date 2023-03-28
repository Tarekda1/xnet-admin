import React from "react";
import { Container, Segment, Header } from "semantic-ui-react";
import { AppSidebar } from "../app_sidebar/AppSidebar";
import { Alert } from "../alert/Alert";
import { TopNavigation } from "../top_nav/TopNavigation";
import styled from "styled-components";
import styles from "./page.module.scss";

const BorderLessSegment = styled(Segment)`
  border: none !important;
  box-shadow: none !important;
`;

const Page = ({ children }) => {
  return (
    <>
      <AppSidebar>
        <Alert />
        <TopNavigation />
        <Container fluid={true} className="resp__container">
          <BorderLessSegment
            className={styles.no__padding}
            style={{ height: "100%" }}
          >
            {children}
          </BorderLessSegment>
        </Container>
      </AppSidebar>
    </>
  );
};

export default Page;
