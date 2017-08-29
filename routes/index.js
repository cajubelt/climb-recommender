var express = require('express');
var router = express.Router();
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

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

	//xpaths of information on scorecard route search page
	var xpath_base = '//*[@id="form1"]//div[4]//table[3]//tbody//tr['
	var row_index_offset = 3; //this is the index of the first climb on a user's scorecard
	var climb_names_xpath = '//*[@id="form1"]//div[4]//table[3]//tbody//tr//td[4]//span[2]';
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
	//TODO get quality-stars rating
	//TODO get recommended/not rating

	//Add the text of information of a specified type to info_json with key info_type, 
	//	given its xpath on the scorecard route search page
	var process_climb_info = function(info_xpath, info_type, info_json, cb){
		var info_elt_promise = driver.findElement(webdriver.By.xpath(info_xpath));
		info_elt_promise.then(function(info_elt){
			info_elt.getText().then(function(info_text){
				info_json[info_type] = info_text;
				cb();
			});
		});
	}

	//Add all the user's climbs to the database!
	//start by getting all the names
	var names_promise = driver.findElements(webdriver.By.xpath(climb_names_xpath));
	names_promise.then(function(names){
		names.forEach(function(name_elt, climb_index){
			name_elt.getText().then(function(name_text){
				var info = {'name':name_text};
				//add grade to info json
				var grade_xpath = climb_grade_xpath(climb_index);
				process_climb_info(grade_xpath, 'grade', info, function(){
					//add date to info json
					var date_xpath = climb_date_xpath(climb_index);
					process_climb_info(date_xpath, 'date', info, function(){
						//add crag to info json
						var crag_xpath = climb_crag_xpath(climb_index);
						process_climb_info(crag_xpath, 'crag', info, function(){
							console.log(JSON.stringify(info));
							//TODO add ascent to database
						});
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
