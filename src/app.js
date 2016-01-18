/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');

var main = new UI.Card({
  title: 'Heizung',
  icon: 'images/menu_icon.png',
  subtitle: '',
  body: '',
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
});

main.show();

ajax(
  {
    url: "http://<server>:<port>/all",
    type: "json"
  },
  function(data) {
    var items = [];
    
    for (var j = 0; j < data.length; j ++) {
      items.push({title: data[j].name, subtitle: data[j].value});      
    }
    
    var menu = new UI.Menu({
      sections: [{items: items}]
    });
    
    menu.show();
    
    menu.on('select', function(e) {
      var card = new UI.Card({title: e.item.title, body: e.item.subtitle});
      card.show();
    });
  },
  function(error) {
    var card = new UI.Card({title: "Error", body: "Unable to fetch data."});
    card.show();
  }
);