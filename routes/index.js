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

	/*WORKING example of getting and logging the first climb name from a nonempty of ascents */
	// var gb_climb_elt = driver.findElement(webdriver.By.xpath('//*[@id="form1"]//div[4]//table[3]//tbody//tr[3]//td[4]//span[2]//i//a')).getText();
	// gb_climb_elt.then(function(name){ 
	// 	console.log(name);
	// });
	//NOTE: this xpath seems to be only for the first climb name (<i> tag not present in following climb rows)

	/*WORKING code block that gets and logs the names of each ascent on the page (EXCEPT the first!) */
	// var climb_names_promise = driver.findElements(webdriver.By.xpath('//*[@id="form1"]//div[4]//table[3]//tbody//tr//td[4]//span[2]//a'));
	// climb_names_promise.then(function(climb_names){
	// 	climb_names.forEach(function(name_promise){
	// 		name_promise.getText().then(function(name_text){
	// 			console.log(name_text);
	// 		});
	// 	});
	// });

	/*WORKING code block that gets and logs the dates of each ascent on the page (INCLUDING the first!) */
	var climb_dates_promise = driver.findElements(webdriver.By.xpath('//*[@id="form1"]//div[4]//table[3]//tbody//tr//td[1]//nobr//i'));
	climb_dates_promise.then(function(climb_dates){
		climb_dates.forEach(function(date_promise){
			date_promise.getText().then(function(date_text){
				console.log(date_text);
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
