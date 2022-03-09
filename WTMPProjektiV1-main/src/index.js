import SodexoData from './modules/sodexo-data';
import FazerData from './modules/fazer-data';
import {fetchData} from './modules/network';
import {getTodayIndex, todayDate} from './modules/tools';
import HSLData from './modules/hsl-data';

// ------------------------------------------------------------------------------------------------------
let language = 'fi';

/**
 * Renders menu courses on page
 */
const renderMenu = (data, targetId) => {
  const ulElement = document.querySelector('#' + targetId);
  ulElement.innerHTML = '';
  for (const item of data) {
    const listElement = document.createElement('li');
    listElement.textContent = item;
    ulElement.appendChild(listElement);
    listElement.classList.add('sodexo-item');
  }
};

// ------------------------------------------------------------------------------------------------------

/**
 * Display pages/vies in carousel mode
 *
 * @param {number} activeView - view index to be displayed
 * @param {number} duration - seconds between page updated
 */
const createViewCarousel = (activeView, duration) => {
  const views = document.querySelectorAll('section');
  for (const view of views) {
    view.style.display = 'none';
  }
  if (activeView === views.length) {
    activeView = 0;
  }
  views[activeView].style.display = 'block';
  setTimeout(() => {
    createViewCarousel(activeView + 1, duration);
  }, duration * 1000);

  // TODO: how frequently to update displayed data?

};

// ------------------------------------------------------------------------------------------------------

/**
 * Initialize application
 */
const init = () => {

  //createViewCarousel(0, 10);

  // Render Sodexo
  fetchData(SodexoData.dataUrlDaily).then(data => {
    console.log('sodexo', data);
    const courses = SodexoData.parseDayMenu(data.courses);
    renderMenu(courses, 'sodexo');
  });


// ------------------------------------------------------------------------------------------------------

  // Playing with hsl data
  fetchData(HSLData.apiUrl, {
    method: 'POST',
    headers: {'Content-Type': 'application/graphql'},
    body: HSLData.getQueryForNextRidesByStopId(2132207)
  }).then(response => {

    // TODO: create separate render HSL data functions (in HSLData module maybe?)
    console.log('hsl data', response.data.stop.stoptimesWithoutPatterns[0]);
    const stop = response.data.stop;

    let time = new Date((stop.stoptimesWithoutPatterns[0].realtimeArrival + stop.stoptimesWithoutPatterns[0].serviceDay) * 1000);
    let time2 = new Date((stop.stoptimesWithoutPatterns[1].realtimeArrival + stop.stoptimesWithoutPatterns[1].serviceDay) * 1000);
    let time3 = new Date((stop.stoptimesWithoutPatterns[2].realtimeArrival + stop.stoptimesWithoutPatterns[2].serviceDay) * 1000);



    document.querySelector('#hsl-data').innerHTML = `
    <h3 id="hsl-item">
       ${stop.name}
    </h3>
    <h3 id="hsl-item">
      ${stop.name}
    </h3>
    <h3 id="hsl-item">
      ${stop.name}
    </h3>
    `;

    document.querySelector('#hsl-data2').innerHTML = `
    <h3 id="hsl-item">
      ${stop.stoptimesWithoutPatterns[0].headsign}
    </h3>
    <h3 id="hsl-item">
      ${stop.stoptimesWithoutPatterns[1].headsign}
    </h3>
    <h3 id="hsl-item">
      ${stop.stoptimesWithoutPatterns[2].headsign}
    </h3>
    `;

    document.querySelector('#hsl-data3').innerHTML = `
    <h3 id="hsl-item">
      ${time.toLocaleString().substr(12, 5)}
    </h3>
    <h3 id="hsl-item">
      ${time2.toLocaleString().substr(12, 5)}
    </h3>
    <h3 id="hsl-item">
      ${time3.toLocaleString().substr(12, 5)}
    </h3>
    `;

  });

// ------------------------------------------------------------------------------------------------------

};
init();



