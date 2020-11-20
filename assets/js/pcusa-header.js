$(function() {
	var hoverPanel = false;
	$("#all-products-dropdown").hover(
		function() {
			$("#all-products").collapse("show");
		},
		function() {
			setTimeout(function(){
				if (hoverPanel == false) $("#all-products").collapse("hide");
			}, 500);
		}
	);
	$("#all-products").hover(
		function() {
			hoverPanel = true;
		},
		function() {
			hoverPanel = false;
			$("#all-products").collapse("hide");
		}
	);

	$("#help-dropdown").hover(
		function() {
			$("#help-content").collapse("show");
		},
		function() {
			setTimeout(function(){
				if (hoverPanel == false) $("#help-content").collapse("hide");
			}, 500);
		}
	);
	$("#help-content").hover(
		function() {
			hoverPanel = true;
		},
		function() {
			hoverPanel = false;
			$("#help-content").collapse("hide");
		}
	);
});
