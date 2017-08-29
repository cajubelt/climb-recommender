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

	//Get the column of information of a specified type, given its xpath on the scorecard route search page
	var get_climbs_info = function(info_xpath, info_type){
		var info_elts_promise = driver.findElements(webdriver.By.xpath(info_xpath));
		info_elts_promise.then(function(info_elts){
			info_elts.forEach(function(info_elt){
				info_elt.getText().then(function(info_text){
					console.log(info_text);
					//TODO add info to database
				});
			});
		});
	}

	var climb_names_xpath = '//*[@id="form1"]//div[4]//table[3]//tbody//tr//td[4]//span[2]';
	var climb_grades_xpath = '//*[@id="form1"]//div[4]//table[3]//tbody//tr//td[2]//b';
	var climb_dates_xpath = '//*[@id="form1"]//div[4]//table[3]//tbody//tr//td[1]//nobr//i';
	var climb_crags_xpath = '//*[@id="form1"]//div[4]/table[3]//tbody//tr//td[6]//span//a';
	get_climbs_info(climb_crags_xpath,'crags');

	//report the name of the page reached
	driver.getTitle().then(function(title){
		// console.log(climbs_list);
		res.render('scrape_results', {scrape: title});
		// driver.quit();
	});

});

module.exports = router;
