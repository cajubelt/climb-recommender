var Constants = {
	ASCENT_TYPE_STRING : {
		REDPOINT: 'redpoint',
		FLASH: 'flash',
		ONSIGHT: 'onsight',
		INCOMPLETE: 'incomplete',
	},

	//prefix substring of the xpath of a cell in the 8a scorecard 
	//	table (routes, all time, ordered by date)
	SCORECARD_XPATH_PREFIX : '//*[@id="form1"]//div[4]//table[3]//tbody//tr[',
	
	//suffix substring of the xpath of a cell in the 8a scorecard
	SCORECARD_XPATH_SUFFIXES : {
		// name : ']//td[4]//span[2]', //dont need this because of how scraper is implemented
		grade : ']//td[2]//b',
		date : ']//td[1]//nobr//i',
		crag : ']//td[6]//span//a',
		stars_rating : ']//td[9]',
		rec_status : ']//td[5]//img',
		notes : ']//td[8]',
		ascent_type : ']//td[3]/img',
	},

	SCORECARD_ASCENT_TYPE_BY_IMG_SRC : {
		'https://www.8a.nu/scorecard/images/979607b133a6622a1fc3443e564d9577.gif' : 'redpoint',
		'https://www.8a.nu/scorecard/images/e9aec9aee0951ec9abfe204498bf95f9.gif' : 'onsight',
		'https://www.8a.nu/scorecard/images/56f871c6548ae32aaa78672c1996df7f.gif' : 'flash',
	},

	// REQUIRED_PROFILE_INFO_IDS : {
	// 	is_female: 'LabelUserName', //note that (f) is present in the name if the user is female
	//     city: 'LabelUserCity',
	//     country: 'LabelUserCountry',
	//     8a_user_id: 'LabelUserId',
	// },

	PROFILE_INFO_IDS : {
		//required
		is_female: 'LabelUserName', //note that (f) is present in the name if the user is female
	    city: 'LabelUserCity',
	    country: 'LabelUserCountry',
	    eightA_user_id: 'LabelUserId',

	    //optional
		birthday : 'LabelUserDataBirth',
		height: 'LabelUserDataHeight',
		weight: 'LabelUserDataWeight',
		started_climbing: 'LabelUserDataStartedClimbing',
		occupation: 'LabelUserDataOccupation',
		other_interests: 'LabelUserDataInterrests',
		best_comp_result: 'LabelUserDataBestResult',
		best_climbing_area: 'LabelUserDataBestClimbingArea',
		sponsor_links: 'LabelUserDataLinks',
		can_guide_areas: 'LabelUserDataGuide',
	},

	//index of first meaningful row of the 8a scorecard table
	SCORECARD_XPATH_ROW_INDEX_OFFSET : 3,
}

module.exports = Object.freeze(Constants);

/*
var climb_name_xpath = function(climb_index){
		var index_string = '' + (row_index_offset + climb_index);
		return xpath_base + index_string + ']//td[4]//span[2]';
	}
	var climb_grades_xpath = '//*[@id="form1"]//div[4]//table[3]//tbody//tr//td[2]//b';
	var climb_grade_xpath = function(climb_index){
		var index_string = '' + (row_index_offset + climb_index);
		return xpath_base + index_string + ']//td[2]//b'
	}
	var climb_dates_xpath = '//*[@id="form1"]//div[4]//table[3]//tbody//tr//td[1]//nobr//i';
	var climb_date_xpath = function(climb_index){
		var index_string = '' + (row_index_offset + climb_index);
		return xpath_base + index_string + ']//td[1]//nobr//i';
	}
	var climb_crags_xpath = '//*[@id="form1"]//div[4]/table[3]//tbody//tr//td[6]//span//a';
	var climb_crag_xpath = function(climb_index){
		var index_string = '' + (row_index_offset + climb_index);
		return xpath_base + index_string + ']//td[6]//span//a';
	}
	var climb_stars_ratings_xpath = '//*[@id="form1"]//div[4]//table[3]//tbody//tr//td[9]';
	var climb_stars_rating_xpath = function(climb_index){
		var index_string = '' + (row_index_offset + climb_index);
		return xpath_base + index_string + ']//td[9]'
	}
	var climb_rec_statuses_xpath = '//*[@id="form1"]//div[4]//table[3]//tbody//tr//td[5]//img';
	var climb_rec_status_xpath = function(climb_index){
		var index_string = '' + (row_index_offset + climb_index);
		return xpath_base + index_string + ']//td[5]//img';
	}
	var climb_notes_xpath = '//*[@id="form1"]//div[4]//table[3]//tbody//tr//td[8]';
	var climb_note_xpath = function(climb_index){
		var index_string = '' + (row_index_offset + climb_index);
		return xpath_base + index_string + ']//td[8]'
	}
	*/