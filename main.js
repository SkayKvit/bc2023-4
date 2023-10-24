const express = require('express');
const fs = require('fs');
const xml2js = require('xml2js');

const app = express();
const port = 8000;

app.get('/', (req, res) => {
  // Прочитати XML-файл
  fs.readFile('data.xml', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Помилка читання XML-файлу');
      return;
    }

    // Розбір XML
    xml2js.parseString(data, (parseErr, result) => {
      if (parseErr) {
        res.status(500).send('Помилка розбору XML');
        return;
      }

      // Знайдіть актив з найменшим значенням
      let min = Number.POSITIVE_INFINITY;
      result.indicators.res.forEach((res) => {
        const value = parseFloat(res.value[0]);
        if (!isNaN(value) && value < min) {
          min = value;
        }
      });

      // Створіть новий XML з мінімальним значенням
      const responseXml = `<data><min_value>${min}</min_value></data>`;

      res.set('Content-Type', 'text/xml');
      res.status(200).send(responseXml);
    });
  });
});

app.listen(port, () => {
  console.log(`Сервер запущений на порті ${port}`);
});
