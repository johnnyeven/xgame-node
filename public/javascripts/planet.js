$(function() {
	var onBuildingInfo = function(data) {
		$("#btn_upgrade").removeAttr('disabled');
		$("#btn_upgrade").removeClass('disabled');
		$("#btn_upgrade").show();
		$("#building_info_message").hide();
		$("#building_info_time").hide();
		if(data && data.code == 200) {
			var building = data.data.building;
			$("#building_info_content > div > div.building_info_attr > h3").text(building.name);
			$("#building_info_content > div > div.building_info_comment > p").text(building.comment);
			if(building.levels.length > 1) {
				var current_level = building.levels[0];
				var next_level = building.levels[1];

				$("#building_info_attr_product tr.production_titanium > td")
					.text(current_level.production.titanium);
				$("#building_info_attr_product tr.production_crystal > td")
					.text(current_level.production.crystal);
				$("#building_info_attr_product tr.production_hydrogen > td")
					.text(current_level.production.hydrogen);
				$("#building_info_attr_product tr.production_water > td")
					.text(current_level.production.water);
				$("#building_info_attr_product tr.production_organics > td")
					.text(current_level.production.organics);

				$("#building_info_attr_product_next tr.production_titanium_next > td")
					.text(next_level.production.titanium);
				$("#building_info_attr_product_next tr.production_crystal_next > td")
					.text(next_level.production.crystal);
				$("#building_info_attr_product_next tr.production_hydrogen_next > td")
					.text(next_level.production.hydrogen);
				$("#building_info_attr_product_next tr.production_water_next > td")
					.text(next_level.production.water);
				$("#building_info_attr_product_next tr.production_organics_next > td")
					.text(next_level.production.organics);
			} else {
				var next_level = building.levels[0];

				$("#building_info_attr_product_next tr.production_titanium_next > td")
					.text(next_level.production.titanium);
				$("#building_info_attr_product_next tr.production_crystal_next > td")
					.text(next_level.production.crystal);
				$("#building_info_attr_product_next tr.production_hydrogen_next > td")
					.text(next_level.production.hydrogen);
				$("#building_info_attr_product_next tr.production_water_next > td")
					.text(next_level.production.water);
				$("#building_info_attr_product_next tr.production_organics_next > td")
					.text(next_level.production.organics);
			}

			$("#building_info_attr_product tr, #building_info_attr_product_next tr").each(function(i) {
				var amount = parseInt($(this).find('td').text());
				if(!amount) {
					$(this).hide();
				} else {
					$(this).show();
				}
			});

			$("#building_info_progress").hide();
			$("#building_info_content").show();

			if(!data.data.can_construct) {
				$("#btn_upgrade").hide();
				showAlert('error', '建造队列已满');
			}

			var b = find_buildings_by_id(data.data.building.id, data.data.planet.buildings);
			if(b) {
				var time = parseInt(new Date().getTime() / 1000);
				var remain = b.complete_time - time;
				if(remain > 0) {
					var time_format;
					if(remain >= 86400) {
						time_format = format(remain, '%d 天 %h:%m:%s');
					} else if(remain >= 3600) {
						time_format = format(remain, '%h:%m:%s');
					} else if(remain >= 60) {
						time_format = format(remain, '%m 分 %s 秒');
					} else if(remain == 0) {
						time_format = '请稍后...';
					} else {
						time_format = format(remain, '%s 秒');
					}
					$("#building_info_time > strong").text(time_format);
					$("#building_info_time > input.remain_time").val(remain);
					$("#building_info_time > input.start_time").val(b.start_time);
					$("#building_info_time > input.end_time").val(b.end_time);
					$("#building_info_time").show();
					$("#btn_upgrade").hide();
				}
			}
		} else {

		}
	};

	var onBuildingUpgrade = function(data) {
		if(data && data.code == 200) {
			$("#btn_upgrade").removeAttr('disabled');
			$("#btn_upgrade").removeClass('disabled');
			$("#btn_upgrade").hide();
			showAlert('success', '操作成功');

			var b = find_buildings_by_id(data.data.building.id, data.data.planet.buildings);
			if(b) {
				var time = parseInt(new Date().getTime() / 1000);
				var remain = b.complete_time - time;
				if(remain > 0) {
					var time_format;
					if(remain >= 86400) {
						time_format = format(remain, '%d 天 %h:%m:%s');
					} else if(remain >= 3600) {
						time_format = format(remain, '%h:%m:%s');
					} else if(remain >= 60) {
						time_format = format(remain, '%m 分 %s 秒');
					} else if(remain == 0) {
						time_format = '请稍后...';
					} else {
						time_format = format(remain, '%s 秒');
					}
					$("#building_info_time > strong").text(time_format);
					$("#building_info_time > input.remain_time").val(remain);
					$("#building_info_time > input.start_time").val(b.start_time);
					$("#building_info_time > input.end_time").val(b.end_time);
					$("#building_info_time").show();

					var html = '<div class="resource_building_construction"><div class="resource_building_upgrade_mask"></div><div class="resource_building_upgrade_time text-center"><strong>' + time_format + '</strong></div><input class="start_time" type="hidden" value="' + b.start_time + '" /><input class="end_time" type="hidden" value="' + b.complete_time + '" /><input class="remain_time" type="hidden" value="' + remain + '" /></div>';
					$(".buildings").find("div." + b.id).prepend(html);
				}

				if(!data.data.can_construct) {
					$(".buildings").find("div.resource_building").each(function() {
						if($(this).find("div.resource_building_construction").length == 0 && !$(this).hasClass("resource_disabled")) {
							$(this).addClass("resource_denied");
						}
					});
				}
			}
		}
	};

	$("#building_info").dialog({
		width: 700,
		height:450,
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
		var planet_id = $("#planet_id").text();
		var href = $(this).attr("href");
		if(planet_id && href) {
			var id = href.substr(1);
			if(id) {
				$("#building_id").text(id);
				$("#building_info_progress").show();
				$("#building_info_content").hide();
				$("#building_info").dialog("open");
				$.post('/game/planet/' + planet_id + '/' + id, null, onBuildingInfo);
			}
		}
	});
	$("#btn_upgrade").click(function() {
		var planet_id = $("#planet_id").text();
		var building_id = $("#building_id").text();
		if(planet_id && building_id) {
			$(this).addClass('disabled');
			$(this).attr('disabled', 'disabled');
			$.post('/game/planet/' + planet_id + '/build', {
				building_id: building_id
			}, onBuildingUpgrade);
		}
	});
	var ipts = $(".buildings > li, #building_info_time").find("input.remain_time");
	if(ipts.length > 0) {
		var timer = setInterval(function() {
			$(".buildings > li, #building_info_time").find("input.remain_time").each(function(i) {
				var v = parseInt($(this).val());
				var end_time = parseInt($(this).prev().val());
				var start_time = parseInt($(this).prev().prev().val());
				if(v > 0) {
					v--;
					var time_format;
					if(v >= 86400) {
						time_format = format(v, '%d 天 %h:%m:%s');
					} else if(v >= 3600) {
						time_format = format(v, '%h:%m:%s');
					} else if(v >= 60) {
						time_format = format(v, '%m 分 %s 秒');
					} else if(v == 0) {
						time_format = '请稍后...';
						clearInterval(timer);
						setTimeout(function() {
							location.href="";
						}, 1000);
					} else {
						time_format = format(v, '%s 秒');
					}
					$(this).prev().prev().prev().find("strong").text(time_format);
					$(this).val(v);
					var percent = parseInt((v / (end_time - start_time)) * 100);
					$(this).parent().find("div:first").width(percent + "%");
				}
			});
		}, 1000);
	}
});

function showAlert(type, content) {
	type = type.toLowerCase();
	$("#building_info_message").removeClass('alert-success').removeClass('alert-error').removeClass('alert-info');
	$("#building_info_message").addClass('alert-' + type);
	$("#building_info_message").find('span').text(content);
	$("#building_info_message").show();
}

function format(time, format) {
	if(time > 0) {
		if(!format) format = '%s';
		var days = 0, hours = 0, minutes = 0, seconds = 0;

		days = parseInt(time / 86400);
		time = time % 86400;
		hours = parseInt(time / 3600);
		time = time % 3600;
		minutes = parseInt(time / 60);
		seconds = time % 60;

		return format.replace('%s', seconds).replace('%m', minutes).replace('%h', hours).replace('%d', days);
	}
}

function find_buildings_by_id(id, buildings) {
	for(var i in buildings) {
		var b = buildings[i];
		if(b.id == id) {
			return b;
		}
	}
	return null;
}