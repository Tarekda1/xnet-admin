import moment from "moment";

const userAccParser = (userAccsArray, useArray = false) => {
  if (
    !userAccsArray ||
    typeof userAccsArray !== "object" ||
    !(userAccsArray instanceof Array)
  ) {
    throw new Error("Invalid data type, expected an array");
  }

  return userAccsArray.reduce((acc, element) => {
    let userAcc;
    if (useArray) {
      userAcc = [
        element[0],
        element[3],
        150000,
        false,
        "",
        new Date().toISOString(),
      ];
    } else {
      userAcc = {
        username: element[0],
        subscribername: element[1],
        subscribtionfees: 150000,
        subscribtionpaid: false,
        collectorname: "",
        paymentDate: new Date().toISOString(),
      };
    }
    acc.push(userAcc);
    return acc;
  }, []);
};

export { userAccParser };
