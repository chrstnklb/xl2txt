module.exports = {

    logServerRouteUpload: function (describer, value) {
        this.logServerRoute(`upload:${describer}:\n\t${value}`);
    },

    logServerRouteDownload: function (describer, value) {
        this.logServerRoute(`download:${describer}:\n\t${value}`);
    },

    logServerRoute: function (route) {
        this.logServer(`route:${route}`);
    },

    logServer: function (message) {
        // new line in console.log
        console.log(`server:${message}`);
    },

    logAttribute: function (attribute, value) {
        this.logServer(`attribute:${attribute}:\n\t${value}`);
    },

    logDeletedFile: function (filename) {
        console.log(`Deleted file:\n\t${filename}`);
    },

    logCreatedFile: function (filename) {
        console.log(`Created file:\n\t${filename}`);
    }
}