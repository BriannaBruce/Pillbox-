
var $el 
  var $autodiv 
  var $inputbox  
  var $userinput 
  var $suggestions 
  var $clone
  
  var items = [];
//creates initial structure
function autocomplete(el, arr) {
  if (!el instanceof HTMLElement) return;
  init(el);
  
  if(Array.isArray(arr)) {
    items = items.concat(arr);
  }
}

function init(el) {
  $el = $(el);
  $autodiv = $('<div/>').addClass('autocomplete').appendTo($el);
  $inputbox = $('<div/>').addClass('inputbox').appendTo($autodiv);
  $userinput = $('<input/>').addClass('userinput').appendTo($inputbox).on('input', onInput).on('keydown', onKeyDown);
  $suggestions = $('<ul/>').addClass('suggestions').appendTo($inputbox);
  $clone = $('<span/>').addClass('clone').insertAfter($el);
  
  var styles = window.getComputedStyle($userinput.get(0));
  $clone.css = ('font', styles.getPropertyValue('font'));
  
  $(document).on('click', function(e) {
      var bool = $.contains($suggestions, $(e.target));
      if(!bool) {
        $suggestions.empty();
      }
  })
  $autodiv.on('click', function() {
    $userinput.focus();
  })
}



function onKeyDown(e) {
 var value = $(this).val();
  var $selected;
  
  if(e.which === 8 && value ==='') {
    e.preventDefault();
    $autodiv.children('button').last().remove();
  }
  //down
 if ($suggestions.children().length) {
   $selected = $suggestions.children('.selected').removeClass('selected');
    if(e.which === 38) {
      e.preventDefault();
   $selected = $selected.prev().length ? $selected.prev() : $selected;
  }
  //up
  if(e.which === 40) {
    e.preventDefault();
    $selected = $selected.next().length ? $selected.next() : $selected;
  }
   $selected.addClass('selected');
 }
 if(e.which === 9 || e.which === 13) {
   e.preventDefault();
   
   if($selected) {
     createButton($selected.text());
   } else {
     createButton(value);
   }
   $suggestions.empty();
   $(this).val("");
 }
}

function onInput(e) {
  var value = $(this).val();
  $clone.text(value);
  var width = Math.max($clone.width(), 4)
  $(this).width(width);
  
  var filtered = items.filter(function(item) {
    return item.toLowerCase().indexOf(value.toLowerCase()) !== -1;
  });
  
  filtered.sort(function(a, b){
     return a.localeCompare(b);
  });
  
  if(!value) filtered = [];
  createSuggestions(filtered);
  
  var comma = value.indexOf(',');
  value = value.replace(',', '');
  if(comma !== -1 && value) {
    createButton(value);
    $(this).val('');
  }
}

function createButton(text) {
  $('<button/>').text(text).insertBefore($inputbox).on('click', removeButton);
}

function createSuggestions(arr) {
  $suggestions.empty();
  arr.forEach(function(suggestion) {
    $('<li/>').text(suggestion).appendTo($suggestions).on('click', function() {
      createButton(suggestion);
      $suggestions.empty();
      $userinput.val('');
   }); 
 });
  $suggestions.children(':first-child').addClass('selected');
}

function removeButton() {
  $(this).remove();
}

var div = document.querySelector('div');
var fruits = ['Apples', 'Bananas', 'Grapes', 'Pears', 'Watermelons', 'Apricots', 'Blueberries']
autocomplete(div, fruits);