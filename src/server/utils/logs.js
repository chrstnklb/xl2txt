module.exports = {

    logServerRouteUpload: function (describer, value) {
        this.logServerRoute(`upload:${describer}:${value}`);
    },

    logServerRouteDownload: function (describer, value) {
        this.logServerRoute(`download:${describer}:${value}`);
    },

    logServerRoute: function (route) {
        this.logServer(`route:${route}`);
    },

    logServer: function (message) {
        console.log(`server:${message}`);
    },
}