/**
 * Get data from the heating control.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');

var main = new UI.Card({
  title: '',
  icon: 'hc.png',
  subtitle: '',
  body: '',
  subtitleColor: 'indigo', // Named colors
  bodyColor: '#9a0036' // Hex colors
});

main.show();

ajax(
  {
    url: "http://192.168.178.62:3000/all",
    type: "json"
  },
  function(data) {
    var items = [];
    
    // create items for every fetched data point
    for (var j = 0; j < data.length; j ++) {
      var subtitle;
      if (data[j].type == 'port') {
        if (data[j].value == '1') {
          subtitle = 'On';
        } else {
          subtitle = 'Off';
        }
      } else {
        subtitle = data[j].value + ' °C';
      }
      items.push({title: data[j].name, subtitle: subtitle, data: data[j]});      
    }
    
    // show the ui
    var menu = new UI.Menu({
      sections: [{items: items}]
    });
    menu.show();
    
    // attach a handler
    menu.on('select', function(e) {
      if (e.item.data.type == 'port') {
        var portItems = [];
        portItems.push({title: e.item.data.name});
        portItems.push({title: 'On', data: e.item.data});
        portItems.push({title: 'Off', data: e.item.data});
        var itemMenu = new UI.Menu({
          sections: [{items: portItems}]
        });
        if (e.item.data.value == '0') {
          itemMenu.selection(0, 2);
        } else {
          itemMenu.selection(0, 1);
        }
        itemMenu.show(); 
        itemMenu.on('select', function(itemE) {
          var triggerUrl = 'http://192.168.178.62:3000/port/' + itemE.item.data.id;
          if (itemE.item.title == 'On') {
            triggerUrl = triggerUrl + "/1";
          } else {
            triggerUrl = triggerUrl + "/0";
          }
          ajax(
            {url: triggerUrl, type: "json"},
            function(data) {
              var card = new UI.Card({title: "Success", body: "Triggered port " + itemE.item.data.id + "\n" + triggerUrl});
              card.show();
            },
            function(error) {
              var card = new UI.Card({title: "Error", body: "Unable to trigger port " + itemE.item.data.id});
              card.show();
            }
          );
        });
      }
      if (e.item.data.type == 'temp') {
        // todo: show a graph
        var card = new UI.Card({title: e.item.title, body: e.item.data.value + ' °C'});
        card.show();  
      }      
    });
  },
  function(error) {
    var card = new UI.Card({title: "Error", body: "Unable to fetch data."});
    card.show();
  }
);