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
        <h3 tagName="h1" headingSize="xl">
          Page Not Found!
        </h3>
        <Ufo />
      </div>
    </Page>
  );
};

export default NotFoundPage;
