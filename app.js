if (typeof document === 'undefined') {
    global.document = {
    querySelector: () => ({ addEventListener: () => {}, textContent: '', innerHTML: '', hidden: true })
    };
}

function buildReport(services, guideChecked, audioChecked, catalogChecked){
    if (!services){
        throw new Error ('недостаточно информации')
    }
    
    const fServices = services.filter((service) => {
        if (!guideChecked && !audioChecked && !catalogChecked) return false;
        if (guideChecked && service.id === "guide") return true;
        if (audioChecked && service.id === "audio") return true;
        if (catalogChecked && service.id === "catalog") return true;
        
        return false
    })

    const items = fServices.map(({title, price}) =>{
        return {title: title.trim(), price: price}
    })

    const total = items.reduce((sum, item) => sum+item.price, 0)
    return {count: items.length, total: total, items: items};
}


const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;
//const data = JSON.parse(sourceJson)

// try{
//     const data = JSON.parse(sourceJson)
//     //console.log('hi')
// }catch(e){
//     console.log('ошибка:', e.message)
// }
//const a = buildReport(data.services, 0, 1, 0)
//console.log(a)

const eventTitleEl = document.querySelector('#event-title');
const showProgramBtn = document.querySelector('#show-program');
const serviceFormEl = document.querySelector('#service-form');
//checboxess
const guideCheckbox = document.querySelector('#guide');
const audioCheckbox = document.querySelector('#audio');
const catalogCheckbox = document.querySelector('#catalog');

// /errors
const choiceErrorEl = document.querySelector('#choice-error');
const dataErrorEl = document.querySelector('#data-error');
const resultEl = document.querySelector('#result');
const reportJsonEl = document.querySelector('#report-json');


let data;
let jsonValid = true;

try {
    data = JSON.parse(sourceJson);
} catch (gav) {
    jsonValid = false;

    if (dataErrorEl) {
    dataErrorEl.textContent = `ошибка: ${gav.message}`;
    dataErrorEl.hidden = false;
    }
    if (serviceFormEl) serviceFormEl.hidden = true;
}

if (jsonValid && data) {
    if (eventTitleEl && data.event) {
    eventTitleEl.textContent = data.event.title;
    }
    if (serviceFormEl) serviceFormEl.hidden = false;

}

if (showProgramBtn) {
    showProgramBtn.addEventListener('click', () => {
    if (data && data.event) {
        showProgramBtn.innerHTML = data.event.meeting;
        showProgramBtn.hidden = false; 
    }
});
}
if (serviceFormEl) {
  serviceFormEl.addEventListener('submit', (event) => {
    event.preventDefault(); 

    const guideChecked = guideCheckbox ? guideCheckbox.checked : false;
    const audioChecked = audioCheckbox ? audioCheckbox.checked : false;
    const catalogChecked = catalogCheckbox ? catalogCheckbox.checked : false;


    const report = buildReport(data.services, guideChecked, audioChecked, catalogChecked);


    if (report.count === 0) {

         if (choiceErrorEl) {
        choiceErrorEl.textContent = "Выберите хотя бы одну услугу.";
        choiceErrorEl.hidden = false;
      }

      if (resultEl) resultEl.hidden = true;
      if (reportJsonEl) reportJsonEl.hidden = true;
    } else {

      if (choiceErrorEl) choiceErrorEl.hidden = true;


        let resultHTML = `Выбрано услуг: ${report.count}
Итого: ${report.total} руб.`;
        report.items.forEach(item => {
        resultHTML += `
${item.title}`;
      });

      
      if (resultEl) {
        resultEl.innerHTML = resultHTML;
        resultEl.hidden = false;
      }
      if (reportJsonEl) {
        reportJsonEl.textContent = JSON.stringify(report);
        reportJsonEl.hidden = false;
      }
    }
  });
}
