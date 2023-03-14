import React from "react";
import Page from "../../components/ui/page/page";

const NotFoundPage = () => {
  // const { isAuthenticated } = useAuth0();

  // if (isAuthenticated) {
  //   return (
  //     <PrivatePage title={PageTitleTypes.NotFoundPage}>
  //       <div className={styles.center}>
  //         <Text tagName="h1" headingSize="xl" className={styles.header}>
  //           {t("common.pageNotFound")}
  //         </Text>
  //         <Ufo />
  //       </div>
  //     </PrivatePage>
  //   );
  // }

  return (
    <Page title="page not found">
      <div>
        <h3>Page Not Found!</h3>
      </div>
    </Page>
  );
};

export default NotFoundPage;
