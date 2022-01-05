$(document).ready(function() {


    if ($("#test").addEventListener) {
    } else {
        $('body').on('contextmenu', 'div.test', function() {
          /**@type {HTMLBodyElement} */
          var elm = event.target
          document.getElementById("userIdConmenu").innerText = elm.id
          document.getElementById("rmenu").className = "show";
          document.getElementById("rmenu").style.top = mouseY(event) + 'px';
          document.getElementById("rmenu").style.left = mouseX(event) + 'px';
    
          window.event.returnValue = false;
  
          return;
        });
        $('body').on('contextmenu', '*', function() {
          window.event.returnValue = false;
  
          return;
        });
    }
  });
  
  $(document).bind("click", function(event) {
    document.getElementById("rmenu").className = "hide";
  });
  
  
  
  function mouseX(evt) {
    if (evt.pageX) {
      return evt.pageX;
    } else if (evt.clientX) {
      return evt.clientX + (document.documentElement.scrollLeft ?
        document.documentElement.scrollLeft :
        document.body.scrollLeft);
    } else {
      return null;
    }
  }
  
  function mouseY(evt) {
    if (evt.pageY) {
      return evt.pageY;
    } else if (evt.clientY) {
      return evt.clientY + (document.documentElement.scrollTop ?
        document.documentElement.scrollTop :
        document.body.scrollTop);
    } else {
      return null;
    }
  }