const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export function getDateString(timestamp) {
    const dat = new Date(timestamp)
    return `${monthNames[dat.getMonth()]} ${dat.getDate()}`
}