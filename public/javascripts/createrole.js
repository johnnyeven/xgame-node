$(function() {
	var currentStage = 0;
	var species = null;
	var nickname = null;
	var attributes = 10;
	var attribute1 = 0;
	var attribute2 = 0;
	var attribute3 = 0;
	var attribute4 = 0;
	var attribute5 = 0;
	var stageName = ['选择种族', '角色名', '配置属性', '完成'];

	var buildBread = function() {
		var html = '<ul class="breadcrumb" id="breadcrumb">';
      	for(var i in stageName) {
      		var divider = '';
      		if(i < stageName.length - 1) {
      			divider = '<span class="divider">/</span>';
      		}
      		if(i == currentStage) {
      			html += '<li class="active">' + stageName[i] + divider + '</li>';
      		} else {
      			html += '<li><a href="#' + i + '">' + stageName[i] + '</a>' + divider + '</li>';
      		}
      	}
      	html += '</ul>';
      	$("#content").before(html);
	};

	var slide = function() {
		var height = $("#slider > div").eq(currentStage).outerHeight();
		$("#content").animate({
			"height": height
		}, function() {
			$("#slider").animate({
				left: -currentStage * 1170
			});
		});

		if(currentStage > 0) {
			$("#prev").show();
			$("#prev > a").text("← " + stageName[currentStage - 1]);
		} else {
			$("#prev").hide();
		}

		if(currentStage < 3) {
			$("#next").show();
			$("#next > a").text(stageName[currentStage + 1] + " →");
		} else {
			$("#next").hide();
		}

		$("#subtitle").text(" / " + stageName[currentStage]);

		$("#breadcrumb").remove();
		buildBread();
	};

	buildBread();
	var height = $("#slider > div").eq(currentStage).height();
	$("#content").height(height);
	$("#prev").hide();
	$("#next > a").text(stageName[currentStage + 1] + " →");	//←
	$("#species > div").click(function() {
		$("#species > div").removeClass("selected");
		$(this).addClass("selected");
		species = $(this).attr("data");
	});

	$("#next").click(function() {
		if(currentStage == 0) {
			if(species) {
				currentStage++;
				slide();
			} else {
				showError("请选择一个种族");
			}
		} else if(currentStage == 1) {
			if($("#iptName").val()) {
				nickname = $("#iptName").val();
				currentStage++;
				slide();
			} else {
				showError("请输入角色名称");
			}
		}

		return false;
	});
	$("#prev").click(function() {
		currentStage--;
		slide();
	});

	$(document).on("click", "#breadcrumb > li > a", function() {
		var link = $(this).attr('href');
		link = parseInt(link.slice(1));
		if(link < currentStage) {
			currentStage = link;
			slide();
		} else {

		}
		return false;
	});

	$("#attribute1, #attribute2, #attribute3, #attribute4, #attribute5").slider({
		range: 'min',
		value: 0,
		min: 0,
		max: 5,
		slide: function(evt, ui) {
			$(this).prev().find("span").text("+" + ui.value);
			var amount = 0;
			for(var i = 1; i < 6; i++) {
				if($("#attribute" + i).attr("id") == $(this).attr("id")) {
					amount += ui.value;
				} else {
					amount += $("#attribute" + i).slider("value");
				}
			}
			$("#remain_points").text(attributes - amount);
		}
	});
});

function showError(message) {
	var html = '<div id="message" class="alert alert-error" style="display:none;"><button type="button" class="close" data-dismiss="alert">&times;</button>' + message + '</div>';
	$("#content").prepend(html);
	$("#message").slideDown();
}