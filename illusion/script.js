let target= document.getElementById("canvas");
if (window.PointerEvent) {
    // if Pointer Events are supported, only listen to pointer events
    target.addEventListener("pointerdown", function(e) {
      console.log("canvas");
        // if necessary, apply separate logic based on e.pointerType
        // for different touch/pen/mouse behavior
       
    });
   
} else {
    // traditional touch/mouse event handlers
    target.addEventListener('touchstart', function(e) {
        // prevent compatibility mouse events and click
        e.preventDefault();
      
    });
    
    target.addEventListener('mousedown', go);
    
}
