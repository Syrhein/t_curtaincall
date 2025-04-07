document.addEventListener('DOMContentLoaded', () => {
    function initializeNavigation() {
        const navigationMappings = [
            { selector: '.BtnLogin', url: 'login.html' },
            { selector: '.icon_my', url: 'MyPage.html' },
            { selector: '.BtnSignUp', url: 'signUp.html' },
            { selector: '.categories .category:nth-child(1)', url: 'cate_create.html' },
            { selector: '.categories .category:nth-child(2)', url: 'cate_license.html' },
            { selector: '.categories .category:nth-child(3)', url: 'Board.jsp' },
            { selector: '.logo', url: 'Main.html' },
        ];

        navigationMappings.forEach(({ selector, url }) => {
            const element = document.querySelector(selector);
            if (element) {
                element.addEventListener('click', () => {
                    window.location.href = url;
                });
            } else {
                console.warn(`Element with selector "${selector}" not found.`);
            }
        });
    }

    initializeNavigation();
});
