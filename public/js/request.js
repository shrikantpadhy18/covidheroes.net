let killOffer;
let emailTo;
let ID;
const matchHtmlRegExp = /["'&<>]/;

async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return await response.text(); // parses JSON response into native JavaScript objects
}

window.onload = async () => {
  const base = `${window.location.origin}/v1/`;
  if (true) {
    let offerList;
    killOffer = (id) => {
      postData(`${base}offer/remove`, {
        id,
      }).then((data) => {
        location = `${window.location.origin}/posts/`;
      });
    };
    fetch(`${window.location.origin}/v1/offer`)
      .then((res) => res.json())
      .then(async (body) => {
        const urlParams = new URLSearchParams(window.location.search);
        const reqId = urlParams.get('id');
        const offer = body.offerList.find((offer) => offer.id === reqId);
        if (!offer) {
          swal(
            {
              title: `Not able to find post.`,
              type: 'warning',
              confirmButtonClass: 'btn-primary',
              confirmButtonText: 'Ok',
              closeOnConfirm: false,
              closeOnCancel: false,
            },
            (isConfirm) => {
              if (isConfirm) {
                location = `${window.location.origin}/posts`;
              }
            }
          );
        }
        let {
          title,
          author,
          date,
          tags,
          email,
          id,
          description,
          type,
          authorid,
          comments,
          skills,
        } = offer;
        console.log(offer);
        let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let months = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ];
        let now = new Date(date);
        date = `${days[now.getDay()]}, ${
          months[now.getMonth()]
        } ${now.getDate()}, ${now.getFullYear()}`;
        if (!type) type = 'request';
        document.querySelector('#reqid').innerText = title;
        if (skills) {
          let skillHTML = '';
          for (let skill of skills) {
            skillHTML += `<span class="badge badge-outline-primary">${skill}</span> `;
          }
          document.querySelector('#skills').innerHTML = skillHTML;
        }
        document.querySelector('#type').innerText =
          type === 'request' ? 'Needs help with' : 'Can help with';
        document.querySelector('#scroll-down').innerHTML = `${
          type || 'request' ? 'Offer to help' : 'Ask for help'
        }`;
        let image =
          (await fetch(`${base}image?word=${title}`).then((res) => res.json())).results[0].url ||
          `/img/${type}-default.jpg`;
        document.querySelector('#title').innerHTML = `
          <div class="d-flex">
            <div>
              ${
                type.charAt(0).toUpperCase() + type.slice(1) === 'Request'
                  ? '<span title="Request"><i class="fas fa-hand-paper" style="color: #F8BB4B !important"></i><span>'
                  : '<span title="Offer"><i class="fas fa-heart" style="color: #EC4561 !important"></i></span>'
              } <b><a class="hover" style="color: #000 !important" data-toggle="tooltip" data-placement="top" title="<img src='https://ui-avatars.com/api/?background=000&color=fff&bold=true&rounded=true&name=${author}'><br>Click to view" href="/profile?id=${authorid}">${author}</a></b>
            </div>
            <div class="ml-auto">
              <span style="color: #A0AECA; font-family: 'Poppins' !important; font-family: bold;">
                <i style="color: #A0AECA !important;" class="fas fa-eye"></i> ${comments + 1 || 1}
              </span>
            </div>
          </div>
        `;
        document.querySelector('#infocard').innerHTML += `
          <hr>
          <div class="d-flex" style="color: #A0AECA">
            <div>
              <p class="card-text">
                ${date}
              </p>
            </div>
            <div class="ml-auto row">
            <div class="fb-share-button col-1" data-href="https://app.covidheroes.net/posts/open?id=${id}" data-layout="button_count" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fcovidheroes.net%2F&amp;src=sdkpreparse" class="fb-xfbml-parse-ignore"><i class="fab fa-facebook"></i></a></div><a
                class="twitter-share-button col-1"
                href="https://twitter.com/intent/tweet?text=COVID+Heroes+-+${title}+-+https://app.covidheroes.net/posts/open?id=${id}"
              ><i class="fab fa-twitter"></i></a>
            </div>
          </div>
        `;
        if (localStorage.getItem('name')) {
          let close = `<button id="del" class="btn btn-primary hover" onclick="if (localStorage.getItem('id') === '${authorid}' || localStorage.getItem('admin')) { if (confirm('Do you want to close request ${id}?')) { killOffer('${id}') } }">Delete</button>&nbsp;&nbsp;`;
          let edit = `<button style="background: #fff !important; color: #6C63FF !important; box-shadow: 0 0 3.2rem rgba(0,0,0,0) !important; text-shadow: 0 0 3.2rem rgba(0,0,0,.12);" class="btn btn-primary hover" id="edit" onclick="editMode()">Edit</button>`;
          if (localStorage.id === authorid || localStorage.admin)
            document.querySelector('#prof-delete').innerHTML = edit + close;
          // document.querySelector('#prof-link').value = `<a href="${
          //   window.location.origin
          // }/@${localStorage.getItem('name')}">${window.location.origin}/@${localStorage.getItem(
          //   'name'
          // )}</a>`;

          // } else document.querySelector('#prof-link').value = 'Login to get a profile link.';
        }
        document.querySelector(
          '#prof-link-author'
        ).innerHTML = `<b>Author: <a href="${window.location.origin}/@${author}">@${author}</a></b>`;
        document.querySelector('#item').innerText = title;
        document.querySelector('#amt').value = tags;
        document.querySelector('#location').value = description;
        emailTo = email;
        ID = id;
        offerList = body.offerList.reverse();
        initService();
        fetch(`${window.location.origin}/v1/offer/increment?id=${ID}`);
      });
    if (localStorage.getItem(ID)) document.querySelector('#fulfill').disabled = true;
  } else {
    window.location = `${window.location.origin}/login`;
  }
};

function esc(string) {
  const str = `${string}`;
  const match = matchHtmlRegExp.exec(str);

  if (!match) {
    return str;
  }

  let escape;
  let html = '';
  let index = 0;
  let lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = '&quot;';
        break;
      case 38: // &
        escape = '&amp;';
        break;
      case 39: // '
        escape = '&#39;';
        break;
      case 60: // <
        escape = '&lt;';
        break;
      case 62: // >
        escape = '&gt;';
        break;
      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
}

function enable() {
  document.querySelector('#submit').disabled = false;
}

let toggler = false;
function editMode() {
  if (toggler) {
    console.log({
      ID,
      tags: document.querySelector('#amt').value,
      title: document.querySelector('#item').innerText,
      description: document.querySelector('#location').value,
    });
    postData(`${location.origin}/v1/offer/edit`, {
      id: ID,
      tags: document.querySelector('#amt').value,
      title: document.querySelector('#item').value,
      description: document.querySelector('#location').value,
    }).then((data) => {
      location.reload();
    });
  } else {
    toggler = true;
    document.querySelector('#amt').readOnly = false;
    document.querySelector('#item').readOnly = false;
    document.querySelector('#location').readOnly = false;
    document.querySelector('#edit').innerText = 'Save';
    document.querySelector('#del').innerText = 'Cancel';
    document.querySelector('#del').onclick = () => {
      location.reload();
    };
    swal(
      'Edit mode enabled!',
      `Click on any of the inputs and type or delete text. Remember to press SAVE when you're done.`,
      'info'
    );
    initAutocomplete();
  }
}
