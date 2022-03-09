//поиск врачей в районе
const puppeteer = require("puppeteer");
const { regions } = require("../data/Regions");

let searchDoctors = async (reg, docFind) => {
  const browser = await puppeteer.launch({ headless: true});
  const page = await browser.newPage();

  for (let region in regions) {
    if (region == reg) {
      var pageURL = regions[region].url;
    }
  }

  try {
    await page.goto(pageURL);

    const currentUrl = page.url()

    var search = async docFind => {
      await page.waitForSelector(".service-mo-1")
      const elements = await page.evaluate(() => {
        let data = [];
        let elements = document.querySelectorAll(".service-mo-1");
        for (let [index, element] of elements.entries()) {
          // Проходимся в цикле по каждому элементу
          let title = element.childNodes[1].innerText; //засносим в массив название каждой найденной поликлиники
          let ind = ++index //присваием ей индекс, начиная с единицы
          //let phone = element.childNodes[3].children[1].innerText
          let address = element.childNodes[3].innerText.replace(/\n/g, '<br>')
          data.push({ind, title, address}); 
        }
       return data;
      });//получаем поликлиники

      var docs = []
      for await (let el of elements) {
        
        const newPage = await browser.newPage();
        await newPage.goto(currentUrl);

        await newPage.waitForSelector(`#serviceMoOutput > div:nth-child(${el.ind}) > button`)
        await newPage.click(`#serviceMoOutput > div:nth-child(${el.ind}) > button`)
        
        try {
          await newPage.waitForSelector(".service-speciality");
          const doctors = await newPage.evaluate(function(poly, find){
            //функции, выполняющиеся на клиенте
            let data = []
            const regexp = /\d+/
            let elements = document.querySelectorAll(".service-speciality");
            for (let [index, element] of elements.entries()) {
              // Проходимся в цикле по каждому элементу
              let quantity = element.childNodes[3].innerText; //получаем строку с количеством номерков
              let doctor = element.childNodes[1].innerText; //заносим в массив специальность каждого доктора
              
                const regExp2 = /[A-ZА-ЯЁ]+[A-ZА-ЯЁ]+[A-ZА-ЯЁ]+[A-ZА-ЯЁ]+[A-ZА-ЯЁ]/gi
                let docs = doctor.match(regExp2)
                let fin = find.match(regExp2)

                fin.forEach(el => el.toLowerCase().slice(0,4))
                docs.forEach(el => el.toLowerCase().slice(0,4))

                for (let doc in docs){
                  for (let i = 0; i < fin.length; i++){
                    if (docs[doc].includes(fin[i]) && quantity.match(regexp)){
                      let url = window.location.href; //добавляем url поликлиники ко всем докторам
                      data.push({ poly, doctor, quantity, url }); //заносим объектом все в массив data
                    }
                  }
                }

                //if (quantity.match(regexp) && inc){
                //let ind = ++index; //присваием ей индекс, начиная с единицы
                //let url = window.location.href; //добавляем url поликлиники ко всем докторам
                //data.push({ poly, doctor, quantity, url }); //заносим объектом все в массив data
              //}
            }
            return data;
          }, el.title, docFind);
          if (doctors.length){
            console.log(doctors)
            docs = docs.concat(doctors)
          }

        } catch (error) {
          console.error(error)
        }
        
        await newPage.close();
      }

      return new Promise ((resolve, reject) => resolve(docs))
    }

    var res = await search(docFind)
    //var res = result
    //console.log(res)

  } catch (e) {
    console.log(`Не удалось открыть страницу: ${pageURL} из-за ошибки: ${e}`);
  }
  browser.close();
  //console.log(doctors)
  return res 
  
};


module.exports = { searchDoctors };