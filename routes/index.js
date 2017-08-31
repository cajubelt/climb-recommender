var express = require('express');
var router = express.Router();
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var Constants = require('../Constants');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/scrape8a', function(req,res,next){
	var member_name = 'charlie andrews'; //TODO replace with inputs to the route

	var driver = new webdriver.Builder()
	    .forBrowser('chrome')
	    .build();

	//Googling cheese example
	// driver.get('https://www.google.com');
	// var element = driver.findElement(webdriver.By.name('q'));
	// element.sendKeys('Cheese!');
	// element.submit();
	// driver.getTitle().then(function(title) {
	// 	console.log('Page title is: ' + title);
 //  		res.render('scrape_results', {scrape: title});
	// });
	
	//Navigate to route and member search page
	driver.get('https://www.8a.nu/scorecard/search.aspx');
	driver.switchTo().frame('main');

	//Search for climber (8a member) by name
	var climber_name = driver.findElement(webdriver.By.name('TextboxMemberName'));
	climber_name.sendKeys(member_name);
	// climber_name.submit();
	var search_button = driver.findElement(webdriver.By.name('ButtonSearchMember'));
	search_button.click();

	//Pull up profile of that climber (TODO (?) store the userID of the climber to more quickly access profile in future using 8a.nu/user/profile.aspx?UserID=<user_id>)
	var profile_link = driver.findElement(webdriver.By.xpath('//*[contains(text(), "Charlie Andrews")]'));
	profile_link.click();
		//You have access to 'recommended routes' from here, which may be enough.. but for now, will go for all routes completed and logged

	//Get all routes (i.e. sport climbs) logged by that climber in order of date
	var routes_link = driver.findElement(webdriver.By.xpath('//*[contains(text(),"Routes")]'));
	routes_link.click();
	var all_time_link = driver.findElement(webdriver.By.xpath('//*[contains(text(),"All Time (All Ascents)")]'));
	all_time_link.click();
	var by_date_link = driver.findElement(webdriver.By.id('HyperLinkOrderByDate'));
	by_date_link.click();

	//xpath of climbs on the scorecard page (routes, all time, ordered by date)
	var climb_names_xpath = '//*[@id="form1"]//div[4]//table[3]//tbody//tr//td[4]//span[2]';

	//Add the text of information of a specified type to info_json with key info_type, 
	//	given its xpath on the scorecard route search page
	var process_climb_info = function(info_xpath, info_type, info_json, cb){
		var info_elt_promise = driver.findElement(webdriver.By.xpath(info_xpath));
		info_elt_promise.then(function(info_elt){
			if (info_type == 'rec_status'){ //true if user recommends, false otherwise
				info_elt.getAttribute('src').then(function(src){
					if (src){
						var recommended = src.includes('1');
						info_json['rec_status'] = recommended;
					} 
					cb();
					//TODO handle case where no src found (rec_status table entry not there?)
				});
			} else if (info_type == 'ascent_type'){
				info_elt.getAttribute('src').then(function(src){
					// console.log('handling ascent type')
					if (src) {
						var ascent_type = Constants.SCORECARD_ASCENT_TYPE_BY_IMG_SRC[src];
						if (!ascent_type){ console.log('ascent type not found'); }
						info_json['ascent_type'] = ascent_type;
					} else {console.log('src not found');}
					cb();
					//TODO handle case where no src round (climb not completed?)
				})
			} else {
				info_elt.getText().then(function(info_text){
					var info_value = info_text;

					//assign the value of 'stars_rating' to number of stars
					if (info_type == 'stars_rating'){
						if (info_text == ' '){
							info_value = 0;
						} else {
							info_value = info_text.length;
						}
					}
					//otherwise keep the value as the text
					info_json[info_type] = info_value;
					cb();
				});
			}
		});
	}

	//Add all the ascents associated with a given user to the database
	//start by getting all the climb names
	var names_promise = driver.findElements(webdriver.By.xpath(climb_names_xpath));
	names_promise.then(function(names){
		names.forEach(function(name_elt, climb_index){
			name_elt.getText().then(function(name_text){
				var info = {'name':name_text};

				var info_keys = Object.keys(Constants.SCORECARD_XPATH_SUFFIXES);
				var num_info_keys_unprocessed = info_keys.length;

				//map types of info to xpath for their cell in the scorecard table
				info_keys.map(function(key){
					var prefix = Constants.SCORECARD_XPATH_PREFIX;
					var elt_index = Constants.SCORECARD_XPATH_ROW_INDEX_OFFSET + climb_index; 
					var suffix = Constants.SCORECARD_XPATH_SUFFIXES[key];
					var xpath =  prefix + elt_index + suffix;
					return [key, xpath];
				}).forEach(function(key_xpath_pair, key_index){
					var info_key = key_xpath_pair[0];
					var info_xpath = key_xpath_pair[1];
					process_climb_info(info_xpath, info_key, info, function(){
						num_info_keys_unprocessed -= 1;

						//when all info has been processed, add ascent to database
						if (num_info_keys_unprocessed == 0){
							console.log(JSON.stringify(info));
							return; //TODO add to database
						}
					});
				});
			});
		});
	});

	//report the name of the page reached
	driver.getTitle().then(function(title){
		// console.log(climbs_list);
		res.render('scrape_results', {scrape: title});
		// driver.quit();
	});

});

module.exports = router;
