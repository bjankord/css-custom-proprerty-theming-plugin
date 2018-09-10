// import './themes/light.css';
import './index.css';
import bar from './bar';

bar();

function changeTheme(theme, themeUrl, currentLink, onLoad) {
  console.log(theme)
  console.log(themeUrl)
  console.log(currentLink)
  if (currentLink) {
    const currentLinkDataset = currentLink.dataset || currentLink.getAttribute('data-theme');
    // if (theme === currentLinkDataset.theme) {
    //   return;
    // }
  }
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = themeUrl;
  if (link.dataset) {
    link.dataset.theme = theme;
    link.setAttribute('id', theme);
  } else {
    link.setAttribute('data-theme', theme);
    link.setAttribute('id', theme);
  }
  const head = document.head || document.getElementsByTagName('head')[0];
  head.appendChild(link);
  link.onload = () => {
    removeTheme(currentLink);
    if (onLoad) {
      onLoad(link);
    }
  };
}

function removeTheme(link) {
  if (link) {
    link.parentNode.removeChild(link);
  }
}


///

const themes = {
  light: '/light.css',
  dark: '/dark.css',
};


const buttonsContainer = document.getElementById('buttons');
let currentLink;

const enableDarkButton = document.createElement('button');
enableDarkButton.innerHTML = 'Enable dark theme';
enableDarkButton.onclick = () => {
  changeTheme('dark', themes['dark'], currentLink, link => (currentLink = link));
};
buttonsContainer.appendChild(enableDarkButton);

const disableDarkButton = document.createElement('button');
disableDarkButton.innerHTML = 'Disable dark theme';

disableDarkButton.onclick = () => {
  const darkTheme = document.getElementById('dark');
  removeTheme(darkTheme);
};
buttonsContainer.appendChild(disableDarkButton);
