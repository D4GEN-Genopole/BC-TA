// GET

module.exports.data_access_get = (req, res) => {
    res.render('dataAccess', {authdec: 'approve'});
}

module.exports.data_access_post = (req, res) => {
    // function to invoke authorization sc => authdec
    res.render('dataAccess', {authdec: 'approve'});
}