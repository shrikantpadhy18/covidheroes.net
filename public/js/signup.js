function enable() {
  document.querySelector('#submit').disabled = false;
}

const matchHtmlRegExp = /["'&<>]/;

window.onload = () => {
  const base = `${window.location.origin}/v1/`;
  if (localStorage.getItem('name')) window.location = `${window.location.origin}/posts`;

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

  document.querySelector('#submit').onclick = async () => {
    function validateEmail(email) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }
    if (
      esc(DOMPurify.sanitize(document.querySelector('#name').value))
        .substring(0, 50)
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, '')
        .replace(/\s/g, '') !==
      esc(DOMPurify.sanitize(document.querySelector('#name').value)).substring(0, 50)
    ) {
      swal(
        'Username must be alphanumeric, lowercase, and contain no spaces.',
        'Only a-z is allowed',
        'warning'
      );
      return false;
    }
    if (
      !validateEmail(
        esc(DOMPurify.sanitize(document.querySelector('#email').value)).substring(0, 50)
      )
    ) {
      swal('Invalid Email', 'Example: hello@example.com', 'warning');
      return false;
    }
    if (
      document.querySelector('#password').value !==
      document.querySelector('#password-confirm').value
    ) {
      swal(
        'Password does not match confirmation',
        'Make sure the password confirmation is the same as your original password.',
        'warning'
      );
      return false;
    }
    postData(`${base}signup`, {
      name: esc(DOMPurify.sanitize(document.querySelector('#name').value))
        .substring(0, 50)
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, '')
        .replace(/\s/g, '')
        .trim(),
      email: esc(DOMPurify.sanitize(document.querySelector('#email').value)).substring(0, 50),
      phone: 'Not Configured',
      location: 'Not Configured',
      password: document.querySelector('#password').value.substring(0, 50).trim(),
      csrf: document.querySelector('#csrf').value,
    }).then((data) => {
      if (data === 'Already Registered')
        return swal('This username is already taken.', '', 'warning');
      localStorage.setItem(
        'name',
        esc(DOMPurify.sanitize(document.querySelector('#name').value))
          .substring(0, 50)
          .toLowerCase()
          .replace(/[^a-z0-9]/gi, '')
          .replace(/\s/g, '')
          .trim()
      );
      localStorage.setItem(
        'email',
        esc(DOMPurify.sanitize(document.querySelector('#email').value)).substring(0, 50)
      );
      localStorage.setItem('phone', 'Not Configured');
      localStorage.setItem('location', 'Not Configured');
      localStorage.setItem('id', data);
      localStorage.setItem('password', document.querySelector('#password').value);
      document.cookie = 'member=true';
      swal(
        {
          title: `You've been logged in!`,
          text: 'Welcome to COVID Heroes. Clicking OK will redirect you to the posts page.',
          type: 'info',
          confirmButtonClass: 'btn-primary',
          confirmButtonText: 'Ok',
          closeOnConfirm: false,
          closeOnCancel: false,
        },
        (isConfirm) => {
          if (localStorage.location === 'Not Configured')
            window.location = `${window.location.origin}/configure`;
          else window.location = `${window.location.origin}/posts`;
        }
      );
    });
  };
};

$('#email').emailautocomplete({
  domains: ['example.com'],
});

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
