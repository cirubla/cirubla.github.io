(function(){
  var comments = atob('H4sICCbRPGQAAzg3ODA0NjU0NTYwMTg2MDYwMjUuanNvbgDFVltvG0UU/ivR1spLvDuXvXlXskKapmkeQBVJ2kLbh/XueHfL7s5qZhzbrSJFUCEkqAI8gBT1CRW1T1CpIFI1Uv8MdsoTf4GZtWM7t9IioLYseeZc9zvnfGfvaVuE8ZQWmq8hA2p1jRQhjdIilhebG5f1hrxqExJp/j2tl2cFl/eJEKUPQLfbNbqmQVkMMIQ2WBI0l9qVVo2WpFgnAQuTqUHgGSHNgQ54SUKgNHilAZCBwMQyjqYWPExIHnAjpjTOSGU9Cia146hGRKDyvA5uacsr76+uX6F3SVq6a/mSd6N3OVhd2TRuaVI1rdKvCakrLfxWRuOYMOWujjzPqy50G5u27UFkWwjbGDvY9YySctFwG9BybMt2IGo40IHYNpRpTgrBte261imjQJBpCAyxqUNTx+4Ggj6EPvYMq4EXYEMelIFIRUYm6stjV3O0mDs8+O7wyZd/7O0OP3t2uHd/8GBv8NMP/tzywsKcOu7+fPj4xfDRg+HO48G3X7367cng+bPB7tPBwc5g95ub5u0/D/YGB58O9vcHj+4ffv25ipWlxSeaf/Oexkj2BrheqGotU+yXMkMtKMssDQMhGwQEsrwLskRSmjDSHjvj0lvJaMyCXBeJDGYoMHlJReVVuePgCC0QkXbQyYRM7CghTrL228ZTjTdTw3GQM+oHzqjdqWQWg0w073BazJedVpbyhER6HvSaM2WEto+wb7mGZeOP56VQZ4RLU960IZxnRM0QaQrWIfOURYS1+s2Jr/mtJp55XhmMsEL2y/ShBekJkIi3RFZWywMQgbDX00NGOdfLLBBtynI9kglltNRNnfRCUio0jcr/NI2k0zoeTQXrtHinJSWtTsuQlZiE0rZv17WgIxLKqlYqgnzavrMtW00DSyeyGaKYrZd8qnaaEYCQayHTdizHM92GLJqDkXIhWzPNJk4KykiZ9d+b8aCU5PineRBXibxhb4ukk7cK5buuddNIKGrCjsKBpHGiYplYnjgL5V8ALKNVHsdcX91YS3AZ3b300Rq4JkJ20WE3YLkGlsafi5sx2LoeXeqtbFofOCHgGEOwoYonE79Txtq2gjImBWGyvZnKfcq/rgEVAVcAngOdFFeYXBxdKRymRFsTVATZh6PO1Hx0TMZFwMRaEZHeBFh0wjwVJOdXCbtaoYrUKhCsX1X8JNeGS+s3una4fsS1166vrvB/gWt1D1l2w4MQW8izTGghVyU5GaZZjkU6QjrEGxj70PVxw8DYm3LsGaT8egPZ8DUSpWJm1dXk3XnrzgVKWH9D58cZf/h0/9XLh8OdncHLXyXF/77/QumEtBAScaU1JoYxJ7zG5gS7q/zfLZmC0wVcPE6A757w/z7Hd0nSizyh3fE7QRM5pt1wMJSvD9i7EJ4xHZPe0l7L0ksFLfo57fD/m1/RMX6tTiN+PUIvzWNUgaZ+lTd5A1pZILGM0/ZiGMh4Tcv1TMfxMDGjADm2QxpQoiHbwCYBtu1oRKwiYbW00Kvn0QWdDrIUzO45llVjzPtFdNR8UoMEERi9A/+3W7iujdz/A3o8o70VoLTDQnL+vj1/XJTT6Vyc7f3UAIyaQx6JXCfRVSZXCBP9mZ7TjoKrjbKcBZxLN1tB1lGyMo1003Zt5ELXrGbuhFGUcolhfyPNyYyZotjB818QGj78Ag+//3FuRLSKXm/L7/Zf0iERSMkMAAA=');

  var input = new Uint8Array(comments.length);
  for (var i = 0; i < comments.length; i++) { input[i] = comments.charCodeAt(i);}
  var output = pako.inflate(input);
  window.g_commentLoader.onLoad(JSON.parse(new TextDecoder("utf-8").decode(output)));
})();