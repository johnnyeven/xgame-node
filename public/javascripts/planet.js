$(function() {
	var onBuildingInfo = function(data) {
		if(data && data.code == 200) {
			var building = data.data;
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
		}
	};

	$("#building_info").dialog({
		width: 700,
		height:400,
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
				$.post('/game/planet/' + planet_id + '/' + id, {}, onBuildingInfo);
			}
		}
	});
});