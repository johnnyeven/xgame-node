$(function() {
	var currentStage = 0;
	var species = null;

	var height = $("#slider > div").eq(currentStage).height();
	$("#content").height(height);
	$("#prev").hide();
	$("#next > a").text("角色名 →");	//←
	$("#species > div").click(function() {
		$("#species > div").removeClass("selected");
		$(this).addClass("selected");
		species = $(this).attr("data");
	});
});