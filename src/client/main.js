function loadComponent(componentId, filePath) {
    fetch(filePath).then(response => response.text()).then(data => {
        document.getElementById(componentId).innerHTML = data;
    });
}

loadComponent('header-content-navigation', 'navigation.html');

loadComponent('main-content-start', 'start.html');
loadComponent('main-content-contact', 'contact.html');
loadComponent('main-content-roadmap', 'roadmap.html');
loadComponent('main-content-feedback', 'feedback.html');
loadComponent('main-content-impressum', 'impressum.html');
