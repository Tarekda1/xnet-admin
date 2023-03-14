import readXlsxFile from "read-excel-file";

export default class DataHelper {
  parseExcelFile = (filePath) => {
    return readXlsxFile(filePath).then((rows) => {
      return {
        header: rows[0],
        data: this.parseRows(rows.slice(1), rows[0]),
      };
    });
  };

  parseRows = (rows, header) => {
    if (!rows || typeof rows !== "object" || !(rows instanceof Array)) {
      throw new Error("Invalid data type, expected an array");
    }
    return rows.reduce((acc, row) => {
      console.log(row);
      let userAcc = row.reduce((acc, col, index) => {
        acc[header[index]] = col;
        return acc;
      }, {});
      acc.push(userAcc);
      return acc;
    }, []);
  };

  getRows = (rows, header) => {
    if (!rows || typeof rows !== "object" || !(rows instanceof Array)) {
      throw new Error("Invalid data type, expected an array");
    }
    return rows.reduce((acc, row) => {
      console.log(row);
      let userAcc = row.reduce((acc, col, index) => {
        acc[header[index]] = col;
        return acc;
      }, {});
      acc.push(userAcc);
      return acc;
    }, []);
  };
}
