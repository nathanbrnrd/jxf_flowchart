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