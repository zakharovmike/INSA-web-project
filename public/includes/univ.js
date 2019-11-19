window.addEventListener('uniLoaded', function(event) {

    var acc=document.getElementsByClassName("navbar__element");
    // var i;

    for (var i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
        	var content=document.getElementsByClassName("content__element")
        	var j;
        	for (j=0; j<content.length; j++)
        	{
        		content[j].style.display = "none";
        	}
        	var id=this.id
        	var panel=document.getElementsByClassName(id)
        	panel[0].style.display = "block";
        });
    }

});