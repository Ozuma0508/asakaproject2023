export class MapInfoIcon {
	iconPath = "data/icon/";

	icons = {
		"階段": {
			"fileName": "stairs.png",
			"shouldShowMapObjName": false,
			"filterItem": null
		},
		"シダックス": {
			"fileName": "diningroom.png",
			"shouldShowMapObjName": true,
			"filterItem": "食堂"
		},
		"男子トイレ": {
			"fileName": "menRestroom.png",
			"shouldShowMapObjName": false,
			"filterItem": "トイレ"
		},
		"女子トイレ": {
			"fileName": "womenRestroom.png",
			"shouldShowMapObjName": false,
			"filterItem": "トイレ"
		},
		"エスカレーター": {
			"fileName": "upEscalator.png",
			"shouldShowMapObjName": false,
			"filterItem": null
		},
		"エレベーター": {
			"fileName": "elevator.png",
			"shouldShowMapObjName": false,
			"filterItem": null
		},
		"プリンター": {
			"fileName": "printer.png",
			"shouldShowMapObjName": false,
			"filterItem": "プリンター"
		},
		"自動販売機": {
			"fileName": "vendingmachine.png",
			"shouldShowMapObjName": false,
			"filterItem": "自販機"
		}
	}

	iconsForBuilding = {
		"10号館": [
			{"fileName": "sharedtoilet.png", "filterItem": "トイレ"},
			{"fileName": "diningroom.png", "filterItem": "食堂"},
			{"fileName": "printer.png", "filterItem": "プリンター"}
		]
	}
}