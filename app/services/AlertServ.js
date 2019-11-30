angular.module("pokeapiApp").service("AlertServ", function (DomServ) {


    var self = this;

    /**
     * Estados de los tipos de alerta.
     * @type {boolean}
     */
    self.SUCCESS = true;
    self.DANGER = false;
    self.PRIMARY = 3;
    self.INFO = 4;
    self.WARNING = 5;

    /**
     * Mensajes de alerta.
     * @type {string}
     */
    self.PROCCESSING = "Procesando...";
    self.ERROR_500 = "<b>Ha ocurrido un error:</b> Por favor, inténtelo de nuevo. " +
        "Si el problema persiste contacte al administrador.";
    self.NO_FILE = "Ningún archivo cargado.";
    self.NO_FILE_IN_SERVER = "No se encuentra el archivo.";

    /**
     * Mostrar alerta
     *
     * @param msg
     * @param status
     * @param alertId
     * @param $scope
     */
    self.showAlert = function (msg, status, alertId, $scope) {
        var alertType;
        switch (status) {
            case self.SUCCESS:
                alertType = "success";
                break;
            case self.DANGER:
                alertType = "danger";
                break;
            case self.PRIMARY:
                alertType = "primary";
                break;
            case self.INFO:
                alertType = "info";
                break;
            case self.WARNING:
                alertType = "warning";
                break;
        }
        $scope[alertId] = {
            type: $scope.alertType = alertType,
            text: $scope.alertText = msg,
            closable: $scope.closable = true,
            delay: $scope.secondsDelay = 0
        };
    };
    self.closeAlert = function () {
        $(".alert-danger").alert("close");
    }

});
