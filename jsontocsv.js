function jsonToCsv(jsonData) {
  if (!jsonData || jsonData.length === 0) {
    return "";
  }

  const header = Object.keys(jsonData[0]);
  const csvRows = [];

  csvRows.push(header.join(","));

  for (const row of jsonData) {
    const values = header.map((fieldName) => {
      const value = row[fieldName] === null || row[fieldName] === undefined ? '' : row[fieldName];
      return JSON.stringify(value);
    });
    csvRows.push(values.join(","));
  }
  return csvRows.join("\r\n");
}

function downloadCsv(csvData, filename = 'data.csv') {
  const blob = new Blob([csvData], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}