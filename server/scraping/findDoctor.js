//вывод поликлиник в выбранном районе
const puppeteer = require("puppeteer");
const { regions } = require("../data/Regions");

let findDoctor = async (reg, index) => {
  const browser = await puppeteer.launch({ headless: true});
  const page = await browser.newPage();

  for (let region in regions) {
    if (region == reg) {
      var pageURL = regions[region].url;
    }
  }

  try {
    await page.goto(pageURL);
    //получаем индекс от пользователя
    await page.waitForSelector(
      `#serviceMoOutput > div:nth-child(${index}) > button`
    );
    await page.click(`#serviceMoOutput > div:nth-child(${index}) > button`);
    await page.waitForSelector(".service-speciality");

    const currentUrl = page.url()

    var doctors = await page.evaluate(() => {
      //функции, выполняющиеся на клиенте
      let data = [];
      let elements = document.querySelectorAll(".service-speciality");
      for (let [index, element] of elements.entries()) {
        // Проходимся в цикле по каждому элементу
        let ind = ++index; //присваием ей индекс, начиная с единицы
        let doctor = element.childNodes[1].innerText; //заносим в массив специальность каждого доктора
        let quantity = element.childNodes[3].innerText; //получаем строку с количеством номерков
        let url = window.location.href; //добавляем url поликлиники ко всем докторам
        data.push({ ind, doctor, quantity, url }); //заносим объектом все в массив data
      }
      return data;
    });

    //получение url для каждого врача
    var addURLS = async (doctors) => {
      const regexp = /\d+/
      for await (let element of doctors) {
        if (element.quantity.match(regexp)){
          const newPage = await browser.newPage();
          await newPage.goto(currentUrl);
          //ждем элемент врача и кликаем на него
          await newPage.waitForSelector(`#specialitiesOutput > div:nth-child(${element.ind}) > button`);
          await newPage.click(`#specialitiesOutput > div:nth-child(${element.ind}) > button`);
          //добавляем url в массив
          element.url = newPage.url()
          await newPage.close();
        }
      }
      return new Promise ((resolve, reject) => resolve(doctors))
    }

    var result = await addURLS(doctors)

  } catch (e) {
    console.log(`Не удалось открыть страницу: ${pageURL} из-за ошибки: ${e}`);
    //var doctors = 'error_service_gorzdrav'
  }
  browser.close();
  return result
  
};

module.exports = { findDoctor };
