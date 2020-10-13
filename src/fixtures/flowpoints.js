export const DUMMY_FLOWPOINTS = [
    {
        id: 0,
        name: "point b",
        comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris quis nibh vel dui lobortis consectetur nec quis quam. Praesent vitae eros augue. Aenean pharetra commodo nunc, quis bibendum mauris molestie id. Praesent porttitor nec risus ut ornare. Phasellus consectetur, elit id rhoncus efficitur, ipsum mauris sagittis massa, eu sagittis ipsum.",
        pos: {
            "x": 50,
            "y": 50
        },
        outputs: [
            {
                linkedTo: 1,
                "output": "auto",
                "input": "auto",
                "dash": 0,
                "arrowEnd": true
            }
        ]
    },
    {
        id: 1,
        name: "point a",
        pos: {
            "x": 50,
            "y": 150
        },
        outputs: [
            {
                linkedTo: 2,
                "output": "auto",
                "input": "auto",
                "dash": 0,
                "arrowEnd": true
            }
        ]
    },
    {
        id: 2,
        name: "point c",
        pos: {
            "x": 230,
            "y": 40
        },
        outputs: []
    }
];

export const DUMMY_PAGE = {
    name: 'Jiu Jitsu counter-attack',
    videos: [],
    notes: 'Bon ok admettons vous avez pris une année sabbatique très bien mais l’année prochaine, vous avez pensé à ça ? L’année prochaine ? C’est pas le monde qui va se plier à vos désirs mes enfants ! C’est pas 68, année de la jeunesse, c’est pas comme ça que ça se passe. C’est le vrai monde dehors et le vrai monde il va chez le coiffeur. Alors gnagna, les guitares, les troubadours tout ça c’est fini !',
    tags: []
};