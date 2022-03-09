//вывод поликлиник в выбранном районе
const puppeteer = require("puppeteer")
const { regions } = require('../data/Regions')

let findPoly = async (reg) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  //const pageURL = regions.cen.url; //получаем от пользователя выбранный район (в данной случае Центральный)
  //const pageURL = ''; //получаем от пользователя выбранный район (в данной случае Центральный)
  for (let region in regions){
    if (region == reg) {
      var pageURL = regions[region].url
    }
  }
  
  try {
    await page.goto(pageURL);
    //выводим пользователю список поликлиник, после выбора одной из них на сервер улетает ее индекс
    //await page.waitForSelector(".service-mo-1__title");
    await page.waitForSelector(".service-mo-1");
    var result = await page.evaluate(() => {
      let data = [];
      //let elements = document.querySelectorAll(".service-mo-1__title");
      let elements = document.querySelectorAll(".service-mo-1");
      for (let [index, element] of elements.entries()) {
        // Проходимся в цикле по каждому элементу
        //let title = element.innerText; //засносим в массив название каждой найденной поликлиники
        let title = element.childNodes[1].innerText; //засносим в массив название каждой найденной поликлиники
        let ind = ++index //присваием ей индекс, начиная с единицы
        //let phone = element.childNodes[3].children[1].innerText
        let address = element.childNodes[3].innerText.replace(/\n/g, '<br>')
        data.push({ind, title, address}); 
      }
      return data;
    });


  } catch (e) {
    console.log(`Не удалось открыть страницу: ${pageURL} из-за ошибки: ${e}`);
  }

  browser.close();
  return result; //возврат массива поликлиник в Центральном раойне
};

 //scrape().then((value) => {
 //  console.log(value);
 //});

module.exports = {findPoly, puppeteer, regions}
