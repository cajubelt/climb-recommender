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
	climber_name.submit();
	var search_button = driver.findElement(webdriver.By.name('ButtonSearchMember'));
	search_button.click();

	//Pull up profile of that climber
	var profile_link = driver.findElement(webdriver.By.xpath('//*[contains(text(), "Charlie Andrews")]'));
	profile_link.click();

	// driver.switch_to.frame('main');

	// var ranking = driver.findElement(webdriver.By.xpath("//*[contains(text(),'Ranking')]"));
	// ranking.click();

	//search an arbitrary crag name and click button (to get to page with member search on it)
	// var fill_field = driver.findElement(webdriver.By.name('CragName')).sendKeys('xxxxx');
	// fill_field.then(function(){
	// console.log('trying to click button');
	// setTimeout(function(){
	// 	driver.findElement(webdriver.By.name('ButtonSearch')).click();
	// },250);
	// }).then(null, function(err){
	// 	if (err.message.includes('not clickable')){//menu hiding the button still
	// 		setTimeout(function(){ //wait and try again to click the button
	// 			console.log('trying again to click button');
	// 			driver.findElement(webdriver.By.name('ButtonSearch')).click();
	// 		},2000)
	// 	}
	// });
	

	//report the name of the page you reach!
	driver.getTitle().then(function(title){
		res.render('scrape_results', {scrape: title});
		// driver.quit();
	});

});

module.exports = router;
