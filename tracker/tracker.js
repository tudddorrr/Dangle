function getParam(name) {
  var url = new URL(window.location);
  return url.searchParams.get(name);
}

var HttpClient = function() {
  this.get = function(url, callback) {
      var req = new XMLHttpRequest();
      req.onreadystatechange = function() { 
          if(req.readyState == 4 && req.status == 200)
          callback(req.responseText);
      }

      req.open("GET", url, true);            
      req.send(null);
  }
}

var client = new HttpClient();
client.get('http://sleepystudios.net/waker.txt', function(response) {
  client.get(response + '/server?id=dangleapi', function(response) {
    window.location.replace('http://' + response + '/issue?id=' + getParam("id"));
  });
});
