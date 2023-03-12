import React from "react";

const page = ({ children, title }) => {
  <>
    <AppSidebar>
      <Alert />
      <TopNavigation i18n={trans} />
      {children}
    </AppSidebar>
  </>;
};

export default page;
