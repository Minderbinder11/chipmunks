import React from 'react';
import ReactDOM from 'react-dom';
import Sidebar from './components/Sidebar.js';
import Store from './components/Store.js';

var insertWhenReady = function() {
  var emails = document.getElementsByClassName('Tm')[0];
  if (emails) {
    var div = document.createElement('div');
    div.id = 'ext';
    var spacer = document.createElement('spacer');
    spacer.id = 'spacer';
    emails.before(spacer);
    emails.before(div);
    ReactDOM.render(<Sidebar />, document.getElementById('ext'));
  } else {
    setTimeout(insertWhenReady, 100);
  }
};

insertWhenReady();

// var observer = new MutationObserver(function(mutations, observer) {
//   // fired when a mutation occurs
//   console.log(mutations, observer);
//   // ...
// });

// // define what element should be observed by the observer
// // and what types of mutations trigger the callback
// observer.observe(document, {
//   subtree: true,
//   childList: true
//   //...
// });