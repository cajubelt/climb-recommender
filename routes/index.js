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

	driver.get('https://www.8a.nu');
	driver.switchTo().frame('main');
	// driver.switch_to.frame('main');

	// var ranking = driver.findElement(webdriver.By.xpath("//*[contains(text(),'Ranking')]"));
	// ranking.click();

	//search an arbitrary crag name
	var fill_field = driver.findElement(webdriver.By.name('CragName')).sendKeys('xxxxx');
	fill_field.then(function(){
		// driver.findElement(webdriver.By.name('ButtonSearch')).click();
		setTimeout(function(){
			driver.findElement(webdriver.By.name('ButtonSearch')).click();
		},1000);
	});
	// setTimeout(function(){driver.findElement(webdriver.By.name('ButtonSearch')).click();},500);

	//report the name of the page you reach!
	driver.getTitle().then(function(title){
		res.render('scrape_results', {scrape: title});
	});

	// driver.wait(function() {
	//   return driver.getTitle().then(function(title) {
	//     return title.toLowerCase().lastIndexOf('cheese!', 0) === 0;
	//   });
	// }, 3000);

	// driver.getTitle().then(function(title) {
	//   console.log('Page title is: ' + title);
	// });

	// driver.quit();
	// driver.get('http://www.google.com/ncr');
	// driver.findElement(By.name('q')).sendKeys('webdriver');
	// driver.findElement(By.name('btnG')).click();
	// driver.wait(until.titleIs('webdriver - Google Search'), 1000);
	// driver.quit();
});

module.exports = router;
