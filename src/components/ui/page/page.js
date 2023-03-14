import React from "react";
import { Container } from "semantic-ui-react";
import { AppSidebar } from "../app_sidebar/AppSidebar";
import { Alert } from "../alert/Alert";
import { TopNavigation } from "../top_nav/TopNavigation";

const Page = ({ children }) => {
  return (
    <>
      <AppSidebar>
        <Alert />
        <TopNavigation />
        <Container fluid={true} className="resp__container">
          {children}
        </Container>
      </AppSidebar>
    </>
  );
};

export default Page;
