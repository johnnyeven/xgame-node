$(function() {
	$("#building_info").dialog({
		resizable: false,
		autoOpen: false,
		modal: true,
		show: {
			effect: 'blind',
			duration: 300
		},
		hide: {
			effect: 'blind',
			duration: 300
		}
	});
	$(".buildings > li > a").click(function() {
		var href = $(this).attr("href");
		if(href) {
			var id = href.substr(1);
			if(id) {
				$("#building_info").dialog("open");
				// $("#building_info").dialog("option", "height", 500);
			}
		}
	});
});