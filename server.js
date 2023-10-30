const http = require('http');
const host = 'localhost';
const port = 8000;
const xml = require('fast-xml-parser');
const fs = require('fs');

const requestListener = function (req, res) {
  res.writeHead(200);
  
  function minvalue(xmldata) {
    let min = 10000;
    for (let list of xmldata.indicators.res) {
      if (list.value < min) {
        min = list.value;
      }
    }
    return min;
  }

  const data = fs.readFileSync('data.xml', 'utf-8');
  const parser = new xml.XMLParser();
  const obj = parser.parse(data);
  const mindata = minvalue(obj);

  const builder = new xml.XMLBuilder({ format: true }); 

  const xmlres = builder.build({
    data: {
      min_value: mindata,
    },
  });

  fs.writeFileSync('res.xml', xmlres);

  res.end(xmlres);
};

const server = http.createServer(requestListener);

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
