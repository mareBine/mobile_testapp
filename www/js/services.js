angular.module('starter.services', [])

    .factory('Chats', function () {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var chats = [
            {
                id: 0,
                name: 'Miha Novak',
                lastText: 'You on your way?',
                face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
            },
            {
                id: 1,
                name: 'Max Lynx',
                lastText: 'Hey, it\'s me',
                face: 'https://pbs.twimg.com/profile_images/479740132258361344/KaYdH9hE.jpeg'
            },
            {
                id: 2,
                name: 'Andrew Jostlin',
                lastText: 'Did you get the ice cream?',
                face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
            },
            {
                id: 3,
                name: 'Adam Bradleyson',
                lastText: 'I should buy a boat',
                face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
            },
            {
                id: 4,
                name: 'Perry Governor',
                lastText: 'Look at my mukluks!',
                face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
            },
            {
                id: 5,
                name: 'Miha Novak',
                lastText: 'You on your way?',
                face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
            },
            {
                id: 6,
                name: 'Max Lynx',
                lastText: 'Hey, it\'s me',
                face: 'https://pbs.twimg.com/profile_images/479740132258361344/KaYdH9hE.jpeg'
            },
            {
                id: 7,
                name: 'Andrew Jostlin',
                lastText: 'Did you get the ice cream?',
                face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
            },
            {
                id: 8,
                name: 'Adam Bradleyson',
                lastText: 'I should buy a boat',
                face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
            },
            {
                id: 9,
                name: 'Perry Governor',
                lastText: 'Look at my mukluks!',
                face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
            },
            {
                id: 10,
                name: 'Miha Novak',
                lastText: 'You on your way?',
                face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
            },
            {
                id: 11,
                name: 'Max Lynx',
                lastText: 'Hey, it\'s me',
                face: 'https://pbs.twimg.com/profile_images/479740132258361344/KaYdH9hE.jpeg'
            },
            {
                id: 12,
                name: 'Andrew Jostlin',
                lastText: 'Did you get the ice cream?',
                face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
            },
            {
                id: 13,
                name: 'Adam Bradleyson',
                lastText: 'I should buy a boat',
                face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
            },
            {
                id: 14,
                name: 'Perry Governor',
                lastText: 'Look at my mukluks!',
                face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
            }
        ];

        return {
            all: function () {
                return chats;
            },
            remove: function (chat) {
                chats.splice(chats.indexOf(chat), 1);
            },
            get: function (chatId) {
                for (var i = 0; i < chats.length; i++) {
                    if (chats[i].id === parseInt(chatId)) {
                        return chats[i];
                    }
                }
                return null;
            }
        }
    });




